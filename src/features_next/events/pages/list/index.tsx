import { Suspense, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Platform, ViewToken } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { getToken, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'

import useLayoutSpacing from '@/components/AppStructure/hooks/useLayoutSpacing'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import { assemblies } from '@/components/AssemblySelect/assemblies'
import BigSwitch, { type OptionsArray } from '@/components/base/BigSwitch'
import { VoxButton } from '@/components/Button'
import { QueryBoundary } from '@/components/QueryBoundary'
import type { EmptyStateReason } from '@/features_next/events/components/feed-layout/EmptyStateSection'
import { EmptyStateSection } from '@/features_next/events/components/feed-layout/EmptyStateSection'
import HubListSkeleton from '@/features_next/events/components/feed-layout/HubListSkeleton'
import { PinnedItemBanner } from '@/features_next/events/components/feed-layout/PinnedItemBanner'
import { FeedSectionHeader } from '@/features_next/events/components/feed-layout/SectionHeader'
import HubSideContent from '@/features_next/events/components/feed-layout/SideContent'
import { HubFeedRow } from '@/features_next/events/components/list-item/HubFeedRow'
import { eventFiltersState, type HubItemTypeFilter } from '@/features_next/events/store/filterStore'
import { groupEventsBySection, isEventPast } from '@/features_next/events/utils'

import { useSession } from '@/ctx/SessionProvider'
import { useHits } from '@/services/hits/hook'
import { hubKeys, useHubItemsInfiniteQuery, usePinnedHubItemsInfiniteQuery } from '@/services/hub/hook'
import { mapHubItemsToPinnedEvents, mapHubItemToFeedRow, type HubFeedRow as HubFeedRowType } from '@/services/hub/mapper'
import type { RestHubItem } from '@/services/hub/schema'
import { useGetProfil } from '@/services/profile/hook'

import { MapListToggle } from '../../components/feed-layout/MapListToggle'
import { HubOrganizeCategoryModal } from '../hub/components/HubOrganizeCategoryModal'

type HubFeedTab = 'all' | 'subscribed'

const HUB_TABS: OptionsArray = [
  { label: 'Tous', value: 'all' },
  { label: "J'y participe", value: 'subscribed' },
]

const ALL_ZONE_DETAIL = { value: 'all', label: 'Toutes' } as const

const getAssemblyDetailZone = (code: string) => {
  const assembly = assemblies.find((a) => a.value === code)
  return assembly ? { value: assembly.value, label: `${assembly.value} • ${assembly.label}` } : { value: code, label: code }
}

type HubFeedSection = {
  id: string
  title: string
  rows: HubFeedRowType[]
}

const filterHubItemsBySearch = (items: RestHubItem[], searchText?: string) => {
  const search = searchText?.trim().toLowerCase() ?? ''
  if (!search) {
    return items
  }
  return items.filter((item) => item.name.toLowerCase().includes(search))
}

const excludeHubItemsByUuid = (items: RestHubItem[], uuids: Set<string>) => (uuids.size === 0 ? items : items.filter((item) => !uuids.has(item.uuid)))

const mapHubItemsToFeedRows = (items: RestHubItem[]): HubFeedRowType[] => items.map(mapHubItemToFeedRow).filter((row): row is HubFeedRowType => row !== null)

const filterRowsByItemType = (rows: HubFeedRowType[], itemType: HubItemTypeFilter): HubFeedRowType[] => {
  if (itemType === 'all') return rows
  return rows.filter((row) => row.type === itemType)
}

const getRowBeginAt = (row: HubFeedRowType): string => (row.type === 'event' ? row.event.begin_at : row.payload.date.start.toISOString())

const isPastRow = (row: HubFeedRowType): boolean => isEventPast({ begin_at: getRowBeginAt(row) })

const defaultUpcomingTitle = (zoneLabel?: string) => (zoneLabel === 'Toutes' ? 'À venir' : zoneLabel ? zoneLabel.replace(' • ', ' - ') : 'À venir')

/** Regroupe le flux hub en sections événements, actions mélangées dans la même section (ordre API). */
const groupHubFeedRows = (rows: HubFeedRowType[], options?: { zoneLabel?: string }): HubFeedSection[] => {
  const zoneLabel = options?.zoneLabel
  const eventRows = rows.filter((row): row is HubFeedRowType & { type: 'event' } => row.type === 'event')

  const eventSections = groupEventsBySection(
    eventRows.map((row) => row.event),
    options,
  )

  const eventUuidToSectionId = new Map(eventSections.flatMap((section) => section.data.map((event) => [event.uuid, section.id] as const)))

  const sectionTitles = new Map(eventSections.map((section) => [section.id, section.title]))
  sectionTitles.set('past', 'Événements passés')
  if (!sectionTitles.has('zone')) {
    sectionTitles.set('zone', defaultUpcomingTitle(zoneLabel))
  }

  const sectionRows = new Map<string, HubFeedRowType[]>(eventSections.map((section) => [section.id, [] as HubFeedRowType[]]))

  let lastUpcomingSectionId = eventSections.find((section) => section.id !== 'past')?.id ?? 'zone'

  for (const row of rows) {
    let sectionId: string

    if (row.type === 'event') {
      sectionId = eventUuidToSectionId.get(row.event.uuid) ?? 'zone'
      if (!isPastRow(row)) {
        lastUpcomingSectionId = sectionId
      }
    } else if (isPastRow(row)) {
      sectionId = 'past'
    } else {
      sectionId = lastUpcomingSectionId
    }

    if (!sectionRows.has(sectionId)) {
      sectionRows.set(sectionId, [])
    }
    sectionRows.get(sectionId)!.push(row)
  }

  const sectionOrder = eventSections.map((section) => section.id)

  return sectionOrder
    .map((id) => ({
      id,
      title: sectionTitles.get(id) ?? id,
      rows: sectionRows.get(id) ?? [],
    }))
    .filter((section) => section.rows.length > 0 || (section.id === 'zone' && zoneLabel != null && zoneLabel !== 'Toutes'))
}

const FEED_VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 400,
} as const

type FeedListItem =
  | { type: 'header'; sectionId: string; title: string }
  | { type: 'hub_row'; row: HubFeedRowType }
  | { type: 'empty_state'; reason: EmptyStateReason }

const HubFeed = () => {
  const media = useMedia()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { session, isAuth } = useSession()
  const { data: userData } = useGetProfil({ enabled: Boolean(session) })
  const { trackImpression } = useHits()

  const [activeTab, setActiveTab] = useState<HubFeedTab>('all')
  const [organizeModalOpen, setOrganizeModalOpen] = useState(false)

  const handleOpenOrganizeModal = useCallback(() => {
    setOrganizeModalOpen(true)
  }, [])

  const handleCloseOrganizeModal = useCallback(() => {
    setOrganizeModalOpen(false)
  }, [])
  const filters = eventFiltersState((s) => s.value)
  const setFiltersValue = eventFiltersState((s) => s.setValue)
  const { itemType: itemTypeParam } = useLocalSearchParams<{ itemType?: string }>()

  useFocusEffect(
    useCallback(() => {
      if (itemTypeParam === 'action' || itemTypeParam === 'event') {
        setFiltersValue((prev) => ({ ...prev, itemType: itemTypeParam }))
      } else {
        setFiltersValue((prev) => ({ ...prev, itemType: 'all' }))
      }
    }, [itemTypeParam, setFiltersValue]),
  )

  const userAssembly = userData?.instances?.assembly?.code
  const zone = filters.zone ?? (activeTab === 'subscribed' ? 'all' : userAssembly)
  const filtersReady = !isAuth || userData !== undefined

  const trackImpressionRef = useRef(trackImpression)
  useEffect(() => {
    trackImpressionRef.current = trackImpression
  }, [trackImpression])

  const listSpacing = useLayoutSpacing('left')
  const { data: pinnedFeed } = usePinnedHubItemsInfiniteQuery()

  const pinnedHubItems = useMemo(() => mapHubItemsToPinnedEvents(pinnedFeed?.pages.flatMap((page) => page?.items ?? []) ?? []), [pinnedFeed?.pages])

  const hasPinnedBannerContent = pinnedHubItems.length > 0

  const feedContentContainerStyle = useMemo(
    () => ({
      gap: getToken('$medium', 'space'),
      // En mobile avec banner pinned, le `ListHeaderComponent` applique déjà le paddingTop
      // (safe area) au-dessus du banner. On neutralise donc le paddingTop du container pour
      // éviter un double espacement.
      paddingTop: hasPinnedBannerContent && media.sm ? 0 : Platform.OS === 'ios' ? 8 : listSpacing.paddingTop,
    }),
    [hasPinnedBannerContent, listSpacing.paddingTop, media.sm],
  )

  const {
    data: paginatedFeed,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isFetching,
    refetch,
  } = useHubItemsInfiniteQuery({
    params: {
      zoneCode: zone,
      subscribedOnly: activeTab === 'subscribed' ? true : undefined,
      pageSize: 20,
    },
    enabled: filtersReady,
  })

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  const handleManualRefresh = useCallback(() => {
    setIsManualRefreshing(true)
    void Promise.all([refetch(), queryClient.refetchQueries({ queryKey: hubKeys.all })]).finally(() => setIsManualRefreshing(false))
  }, [refetch, queryClient])

  const loadMore = useDebouncedCallback(
    () => {
      if (!isRefetching && hasNextPage) fetchNextPage()
    },
    1000,
    { leading: true, trailing: false },
  )

  const handleSwitchToAllItems = useCallback(() => {
    setActiveTab('all')
    if (userAssembly) {
      setFiltersValue((prev) => ({ ...prev, zone: userAssembly, detailZone: getAssemblyDetailZone(userAssembly) }))
    }
  }, [setFiltersValue, userAssembly])

  const pinnedItemsUuids = useMemo(() => new Set(pinnedHubItems.map((item) => item.uuid)), [pinnedHubItems])

  const feedRows = useMemo(() => {
    const items = paginatedFeed?.pages.flatMap((page) => page?.items ?? []) ?? []
    const withoutPinned = excludeHubItemsByUuid(items, pinnedItemsUuids)
    const searched = filterHubItemsBySearch(withoutPinned, filters.search)
    return filterRowsByItemType(mapHubItemsToFeedRows(searched), filters.itemType ?? 'all')
  }, [paginatedFeed?.pages, pinnedItemsUuids, filters.search, filters.itemType])

  const hasActiveFilters = useMemo(() => {
    if (filters.search.trim()) return true
    if (activeTab === 'subscribed') return Boolean(filters.zone && filters.zone !== 'all')
    return Boolean(filters.zone && filters.zone !== userAssembly)
  }, [filters.search, filters.zone, userAssembly, activeTab])

  const feedState = useMemo(() => {
    if (isFetching && feedRows.length === 0) {
      return { sectionedData: [], emptyReason: { kind: 'generic' } as EmptyStateReason }
    }

    const zoneLabel = filters.detailZone?.label
    const sections = groupHubFeedRows(feedRows, { zoneLabel })
    const hasUpcoming = sections.some((s) => s.id !== 'past' && s.rows.length > 0)
    const hasOnlyPast = !hasUpcoming && sections.some((s) => s.id === 'past' && s.rows.length > 0)
    const isSearchActive = filters.search.trim().length > 0

    let globalReason: EmptyStateReason | null = null

    if (feedRows.length === 0) {
      if (isSearchActive) globalReason = { kind: 'search_no_results', search: filters.search }
      else if (activeTab === 'subscribed') globalReason = { kind: 'subscriptions_empty' }
      else if (zoneLabel && zoneLabel !== 'Toutes') globalReason = { kind: 'zone_no_upcoming', zoneLabel }
      else globalReason = { kind: 'generic' }
    } else if (hasOnlyPast && (isSearchActive || activeTab === 'subscribed')) {
      globalReason =
        activeTab === 'subscribed' ? { kind: 'subscriptions_no_upcoming' } : { kind: 'search_no_upcoming', search: filters.search.trim() || undefined }
    }

    const items: FeedListItem[] = []

    if (globalReason && feedRows.length > 0) {
      items.push({ type: 'empty_state', reason: globalReason })
    }

    sections.forEach((section) => {
      if (section.id === 'zone' && section.rows.length === 0 && zoneLabel && zoneLabel !== 'Toutes') {
        if (!globalReason) {
          items.push({ type: 'empty_state', reason: { kind: 'zone_no_upcoming', zoneLabel } })
        }
        return
      }

      if (section.rows.length > 0) {
        items.push({ type: 'header', sectionId: section.id, title: section.title })
        section.rows.forEach((row) => items.push({ type: 'hub_row', row }))
      }
    })

    return { sectionedData: items, emptyReason: (globalReason ?? { kind: 'generic' }) as EmptyStateReason }
  }, [feedRows, filters.search, filters.detailZone?.label, activeTab, isFetching])

  const deferredFeed = useDeferredValue(feedState)

  // Garde le skeleton si deferredFeed retarde (évite le flash EmptyState)
  const isDeferredLagging = deferredFeed.sectionedData.length === 0 && feedState.sectionedData.length > 0
  const showSkeleton = isFetching || isDeferredLagging || !filtersReady || !filtersReady

  const flatListRef = useRef<FlatList<FeedListItem>>(null)
  useScrollToTop(flatListRef)

  const renderItem = useCallback(
    ({ item }: { item: FeedListItem }) => {
      switch (item.type) {
        case 'header':
          return <FeedSectionHeader title={item.title} />
        case 'empty_state':
          return (
            <YStack py="$large">
              <EmptyStateSection reason={item.reason} onSwitchToAllItems={handleSwitchToAllItems} showResetButton={hasActiveFilters} />
            </YStack>
          )
        case 'hub_row':
          return <HubFeedRow row={item.row} userUuid={userData?.uuid} source="page_events" />
        default:
          return null
      }
    },
    [userData?.uuid, hasActiveFilters, handleSwitchToAllItems],
  )

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (Platform.OS === 'web') return
    viewableItems.forEach((viewToken) => {
      if (viewToken.isViewable && viewToken.item?.type === 'hub_row') {
        const row = viewToken.item.row
        if (row.type === 'event') {
          trackImpressionRef.current({
            object_type: 'event',
            object_id: row.event.uuid,
            source: 'page_events',
          })
        } else if (row.payload.id) {
          trackImpressionRef.current({
            object_type: 'action',
            object_id: row.payload.id,
            source: 'page_events',
          })
        }
      }
    })
  }, [])

  const handleSwitchChange = useCallback(
    (value: string | undefined) => {
      if (value !== 'all' && value !== 'subscribed') return

      setActiveTab(value)

      if (value === 'subscribed') {
        setFiltersValue((prev) => ({ ...prev, zone: 'all', detailZone: ALL_ZONE_DETAIL }))
      } else if (userAssembly) {
        setFiltersValue((prev) => ({ ...prev, zone: userAssembly, detailZone: getAssemblyDetailZone(userAssembly) }))
      }
    },
    [setFiltersValue, userAssembly],
  )

  const bannerSafeAreaTop = useMemo(() => {
    // - Non authentifié : Layout rend un Header en mobile qui applique déjà `insets.top`
    //   (voir `src/components/AppStructure/Layout/Layout.tsx` + `Header/index.tsx`).
    // - Authentifié sur iOS : la FlatList applique le safe area via
    //   `contentInsetAdjustmentBehavior='automatic'`.
    // - Authentifié sur Android : rien n'applique le safe area en amont → padding sur le bloc header au-dessus du banner.
    if (!isAuth) return false
    return Platform.OS === 'android'
  }, [isAuth])

  const pinnedBannerOuterSpacing = useLayoutSpacing({
    top: true,
    safeAreaTop: bannerSafeAreaTop,
    left: false,
    right: false,
    bottom: false,
  })

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push('/evenements/hub')
    }
  }, [router])

  const listHeader = useMemo(
    () => (
      <YStack>
        {media.sm ? (
          <YStack paddingTop={pinnedBannerOuterSpacing.paddingTop} paddingBottom={16} gap="$medium">
            <XStack alignItems="center" justifyContent="space-between" gap="$small" px="$medium">
              <VoxButton variant="soft" size="lg" shrink iconLeft={ArrowLeft} theme="gray" bg="$white1" onPress={handleBack} aria-label="Retour " />
              <MapListToggle activeView="list" mapHref="/evenements/map" listHref="/evenements/list" />
            </XStack>
            <QueryBoundary>
              <PinnedItemBanner />
            </QueryBoundary>
          </YStack>
        ) : null}
        <YStack gap="$medium" px={media.sm ? '$medium' : 0}>
          {isAuth && <BigSwitch options={HUB_TABS} value={activeTab} onChange={handleSwitchChange} />}
          {!media.gtMd && <HubSideContent onOpenOrganizeModal={handleOpenOrganizeModal} />}
        </YStack>
      </YStack>
    ),
    [activeTab, media.gtMd, media.sm, isAuth, handleBack, handleSwitchChange, handleOpenOrganizeModal, pinnedBannerOuterSpacing.paddingTop],
  )

  const organizeModal = organizeModalOpen ? (
    <Suspense fallback={null}>
      <HubOrganizeCategoryModal open onClose={handleCloseOrganizeModal} />
    </Suspense>
  ) : null

  return (
    <>
      <Layout.Main width="100%">
        <LayoutFlatList<FeedListItem>
          ref={flatListRef}
          padding="left"
          data={deferredFeed.sectionedData}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.type === 'header'
              ? `h-${item.sectionId}`
              : item.type === 'empty_state'
                ? `e-${item.reason.kind}${item.reason.kind === 'zone_no_upcoming' ? `-${item.reason.zoneLabel}` : ''}`
                : item.row.type === 'event'
                  ? item.row.event.uuid
                  : (item.row.payload.id ?? item.row.payload.tag)
          }
          ListHeaderComponent={listHeader}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={FEED_VIEWABILITY_CONFIG}
          refreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          hasMore={hasNextPage ?? false}
          contentContainerStyle={feedContentContainerStyle}
          removeClippedSubviews={Platform.OS === 'android'}
          windowSize={21}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ListEmptyComponent={
            showSkeleton ? (
              <HubListSkeleton />
            ) : (
              <YStack py="$large">
                <EmptyStateSection reason={deferredFeed.emptyReason} onSwitchToAllItems={handleSwitchToAllItems} showResetButton={hasActiveFilters} />
              </YStack>
            )
          }
          ListFooterComponent={
            hasNextPage ? (
              <YStack p="$medium" pb="$large">
                <Spinner size="large" />
              </YStack>
            ) : null
          }
        />
      </Layout.Main>
      {media.gtMd ? (
        <Layout.SideBar isSticky padding="right">
          <YStack>
            <HubSideContent onOpenOrganizeModal={handleOpenOrganizeModal} />
          </YStack>
        </Layout.SideBar>
      ) : null}
      {organizeModal}
    </>
  )
}

export default HubFeed
