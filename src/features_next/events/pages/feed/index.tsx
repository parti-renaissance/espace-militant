import { memo, Suspense, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Platform, ViewToken } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import { getToken, Spinner, useMedia, YStack } from 'tamagui'
import { useQueryClient } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'

import useLayoutSpacing from '@/components/AppStructure/hooks/useLayoutSpacing'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import BigSwitch, { type OptionsArray } from '@/components/base/BigSwitch'
import TrackImpressionWeb from '@/components/TrackImpressionWeb'
import EventListItem from '@/features_next/events/components/EventListItem'
import { eventFiltersState } from '@/features_next/events/store/filterStore'
import { groupEventsBySection } from '@/features_next/events/utils'
import { PinnedEventBanner } from '@/features_next/events/pages/feed/components/PinnedEventBanner'

import { useSession } from '@/ctx/SessionProvider'
import { usePinnedEventsInfiniteQuery, useSuspensePaginatedEvents } from '@/services/events/hook'
import { QUERY_KEY_PAGINATED_SHORT_EVENTS } from '@/services/events/hook/queryKeys'
import { RestItemEvent, RestPublicItemEvent } from '@/services/events/schema'
import { useHits } from '@/services/hits/hook'
import { useGetProfil } from '@/services/profile/hook'

import type { EmptyStateReason } from './components/EmptyStateSection'
import { EmptyStateSection } from './components/EmptyStateSection'
import { EventSectionHeader } from './components/SectionHeader'
import EventsSideContent from './components/SideContent'
import EventsListSkeleton from './components/Skeleton'

const EVENTS_SWITCH_OPTIONS: OptionsArray = [
  { label: 'Tous', value: 'events' },
  { label: "J'y participe", value: 'myEvents' },
]

const FEED_VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 400,
} as const

type FeedListItem =
  | { type: 'header'; sectionId: string; title: string }
  | { type: 'event'; event: RestItemEvent | RestPublicItemEvent }
  | { type: 'empty_state'; reason: EmptyStateReason }

const EventCard = memo(({ event, userUuid, source }: { event: RestItemEvent | RestPublicItemEvent; userUuid?: string; source: string }) => {
  const content = <EventListItem event={event} userUuid={userUuid} source={source} />

  if (Platform.OS === 'web') {
    return (
      <TrackImpressionWeb objectType="event" objectId={event.uuid} source={source}>
        {content}
      </TrackImpressionWeb>
    )
  }
  return content
})

const EventFeed = () => {
  const media = useMedia()
  const queryClient = useQueryClient()
  const { session, isAuth } = useSession()
  const { data: userData } = useGetProfil({ enabled: Boolean(session) })
  const { trackImpression } = useHits()

  const [activeTab, setActiveTab] = useState<'events' | 'myEvents'>('events')
  const filtersValue = eventFiltersState((s) => s.value)
  const filters = filtersValue

  const zone = filters.zone ?? userData?.instances?.assembly?.code
  const filtersReady = !isAuth || userData !== undefined

  const trackImpressionRef = useRef(trackImpression)
  useEffect(() => {
    trackImpressionRef.current = trackImpression
  }, [trackImpression])

  const listSpacing = useLayoutSpacing('left')
  const { data: pinnedFeed } = usePinnedEventsInfiniteQuery()

  const hasPinnedBannerContent = useMemo(() => {
    const items = pinnedFeed?.pages.flatMap((p) => p?.items ?? []) ?? []
    return items.length > 0
  }, [pinnedFeed?.pages])

  const feedContentContainerStyle = useMemo(
    () => ({
      gap: getToken('$medium', 'space'),
      // En mobile avec banner pinned, celui-ci est rendu dans `ListHeaderComponent` et
      // fournit déjà son propre paddingTop (safe area). On neutralise donc le paddingTop
      // du container pour éviter un double espacement.
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
  } = useSuspensePaginatedEvents({
    filters: { searchText: filters.search, zone, subscribedOnly: activeTab === 'myEvents' ? true : undefined },
    enabled: filtersReady,
  })

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  const handleManualRefresh = useCallback(() => {
    setIsManualRefreshing(true)
    const scope = isAuth ? 'private' : 'public'
    void Promise.all([refetch(), queryClient.refetchQueries({ queryKey: [QUERY_KEY_PAGINATED_SHORT_EVENTS, scope, 'pinned'] })]).finally(() =>
      setIsManualRefreshing(false),
    )
  }, [refetch, queryClient, isAuth])

  const loadMore = useDebouncedCallback(
    () => {
      if (!isRefetching && hasNextPage) fetchNextPage()
    },
    1000,
    { leading: true, trailing: false },
  )

  const handleSwitchToAllEvents = useCallback(() => setActiveTab('events'), [])

  const upcomingPinnedUuids = useMemo(() => {
    const items = pinnedFeed?.pages.flatMap((p) => p?.items ?? []) ?? []
    return new Set(items.map((item) => item.uuid))
  }, [pinnedFeed?.pages])

  const feedData = useMemo(() => {
    const items = paginatedFeed?.pages.flatMap((page) => page.items) ?? []
    if (upcomingPinnedUuids.size === 0) return items
    return items.filter((event) => !upcomingPinnedUuids.has(event.uuid))
  }, [paginatedFeed, upcomingPinnedUuids])

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search.trim() || (filters.zone && filters.zone !== userData?.instances?.assembly?.code)),
    [filters.search, filters.zone, userData?.instances?.assembly?.code],
  )

  const feedState = useMemo(() => {
    if (isFetching && feedData.length === 0) {
      return { sectionedData: [], emptyReason: { kind: 'generic' } as EmptyStateReason }
    }

    const zoneLabel = filters.detailZone?.label
    const sections = groupEventsBySection(feedData, { zoneLabel })
    const hasUpcoming = sections.some((s) => s.id !== 'past' && s.data.length > 0)
    const hasOnlyPast = !hasUpcoming && sections.some((s) => s.id === 'past' && s.data.length > 0)
    const isSearchActive = filters.search.trim().length > 0

    let globalReason: EmptyStateReason | null = null

    if (feedData.length === 0) {
      if (isSearchActive) globalReason = { kind: 'search_no_results', search: filters.search }
      else if (activeTab === 'myEvents') globalReason = { kind: 'subscriptions_empty' }
      else if (zoneLabel && zoneLabel !== 'Toutes') globalReason = { kind: 'zone_no_upcoming', zoneLabel }
      else globalReason = { kind: 'generic' }
    } else if (hasOnlyPast && (isSearchActive || activeTab === 'myEvents')) {
      globalReason =
        activeTab === 'myEvents' ? { kind: 'subscriptions_no_upcoming' } : { kind: 'search_no_upcoming', search: filters.search.trim() || undefined }
    }

    const items: FeedListItem[] = []

    if (globalReason && feedData.length > 0) {
      items.push({ type: 'empty_state', reason: globalReason })
    }

    sections.forEach((section) => {
      if (section.id === 'zone' && section.data.length === 0 && zoneLabel && zoneLabel !== 'Toutes') {
        if (!globalReason) {
          items.push({ type: 'empty_state', reason: { kind: 'zone_no_upcoming', zoneLabel } })
        }
        return
      }

      if (section.data.length > 0) {
        items.push({ type: 'header', sectionId: section.id, title: section.title })
        section.data.forEach((event) => items.push({ type: 'event', event }))
      }
    })

    return { sectionedData: items, emptyReason: (globalReason ?? { kind: 'generic' }) as EmptyStateReason }
  }, [feedData, filters.search, filters.detailZone?.label, activeTab, isFetching])

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
          return <EventSectionHeader title={item.title} />
        case 'empty_state':
          return <EmptyStateSection reason={item.reason} onSwitchToAllEvents={handleSwitchToAllEvents} showResetButton={hasActiveFilters} />
        case 'event':
          return <EventCard event={item.event} userUuid={userData?.uuid} source="page_events" />
        default:
          return null
      }
    },
    [userData?.uuid, hasActiveFilters, handleSwitchToAllEvents],
  )

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (Platform.OS === 'web') return
    viewableItems.forEach((viewToken) => {
      if (viewToken.isViewable && viewToken.item?.type === 'event') {
        trackImpressionRef.current({
          object_type: 'event',
          object_id: viewToken.item.event.uuid,
          source: 'page_events',
        })
      }
    })
  }, [])

  const handleSwitchChange = useCallback((value: string | undefined) => {
    if (value === 'events' || value === 'myEvents') setActiveTab(value)
  }, [])

  const bannerSafeAreaTop = useMemo(() => {
    // - Non authentifié : Layout rend un Header en mobile qui applique déjà `insets.top`
    //   (voir `src/components/AppStructure/Layout/Layout.tsx` + `Header/index.tsx`).
    // - Authentifié sur iOS : la FlatList applique le safe area via
    //   `contentInsetAdjustmentBehavior='automatic'`.
    // - Authentifié sur Android : rien n'applique le safe area en amont, le banner s'en charge.
    if (!isAuth) return false
    return Platform.OS === 'android'
  }, [isAuth])

  const listHeader = useMemo(
    () => (
      <YStack>
        {media.sm ? (
          <Suspense fallback={null}>
            <PinnedEventBanner safeAreaTop={bannerSafeAreaTop} />
          </Suspense>
        ) : null}
        <YStack gap="$medium" px={media.sm ? '$medium' : 0}>
          {isAuth && <BigSwitch options={EVENTS_SWITCH_OPTIONS} value={activeTab} onChange={handleSwitchChange} />}
          {!media.gtMd && <EventsSideContent />}
        </YStack>
      </YStack>
    ),
    [activeTab, media.gtMd, media.sm, isAuth, handleSwitchChange, bannerSafeAreaTop],
  )

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
                : item.event.uuid
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
              <EventsListSkeleton />
            ) : (
              <EmptyStateSection reason={deferredFeed.emptyReason} onSwitchToAllEvents={handleSwitchToAllEvents} showResetButton={hasActiveFilters} />
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
            <EventsSideContent />
          </YStack>
        </Layout.SideBar>
      ) : null}
    </>
  )
}

export default EventFeed
