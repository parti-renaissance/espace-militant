'use no memo'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { getToken, useMedia } from 'tamagui'
import { useQueryClient } from '@tanstack/react-query'

import useLayoutSpacing from '@/components/AppStructure/hooks/useLayoutSpacing'
import { defaultEventFilters, eventFiltersState, type HubItemTypeFilter } from '@/features/events/store/filterStore'
import { useOpenOrganiserEvenement } from '@/features/profil/hooks/useOpenOrganiserEvenement'

import { useSession } from '@/ctx/SessionProvider'
import { hubKeys, useHubItemsInfiniteQuery, usePinnedHubItemsInfiniteQuery } from '@/services/hub/hook'
import { mapHubItemsToPinnedEvents } from '@/services/hub/mapper'
import { useGetProfil } from '@/services/profile/hook'

import { ALL_ZONE_DETAIL, getAssemblyDetailZone } from '../helpers/assemblyZone'
import { buildFeedState } from '../helpers/buildFeedState'
import { excludeHubItemsByUuid, filterHubItemsBySearch, filterRowsByItemType, mapHubItemsToFeedRows } from '../helpers/hubFeed'
import type { HubFeedTab } from '../types'

const LOAD_MORE_DEBOUNCE_MS = 1000

type UseEventsListPageOptions = {
  itemType?: string
}

export function useEventsListPage({ itemType: itemTypeParam }: UseEventsListPageOptions) {
  const media = useMedia()
  const queryClient = useQueryClient()
  const { session, isAuth } = useSession()
  const { data: userData } = useGetProfil({ enabled: Boolean(session) })

  const [activeTab, setActiveTab] = useState<HubFeedTab>('all')
  const [organizeModalOpen, setOrganizeModalOpen] = useState(false)

  const { openOrganiserModal } = useOpenOrganiserEvenement()

  const filters = eventFiltersState((s) => s.value ?? defaultEventFilters)
  const setFiltersValue = eventFiltersState((s) => s.setValue)

  useEffect(() => {
    if (itemTypeParam !== 'action' && itemTypeParam !== 'event') return
    setFiltersValue((prev) => (prev.itemType === itemTypeParam ? prev : { ...prev, itemType: itemTypeParam }))
  }, [itemTypeParam, setFiltersValue])

  const effectiveItemType: HubItemTypeFilter =
    itemTypeParam === 'action' || itemTypeParam === 'event' ? itemTypeParam : (filters?.itemType ?? 'all')

  const userAssembly = userData?.instances?.assembly?.code
  const zone = filters?.zone ?? (activeTab === 'subscribed' ? 'all' : userAssembly)
  const filtersReady = !isAuth || userData !== undefined

  const listSpacing = useLayoutSpacing('left')
  const { data: pinnedFeed } = usePinnedHubItemsInfiniteQuery()

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

  const isRefetchingRef = useRef(isRefetching)
  const hasNextPageRef = useRef(hasNextPage)
  const fetchNextPageRef = useRef(fetchNextPage)
  const loadMoreLockedRef = useRef(false)

  isRefetchingRef.current = isRefetching
  hasNextPageRef.current = hasNextPage
  fetchNextPageRef.current = fetchNextPage

  const loadMore = useCallback(() => {
    if (loadMoreLockedRef.current) return
    if (isRefetchingRef.current || !hasNextPageRef.current) return

    loadMoreLockedRef.current = true
    fetchNextPageRef.current()

    setTimeout(() => {
      loadMoreLockedRef.current = false
    }, LOAD_MORE_DEBOUNCE_MS)
  }, [])

  const bannerSafeAreaTop = !isAuth ? false : Platform.OS === 'android'
  const pinnedBannerOuterSpacing = useLayoutSpacing({
    top: true,
    safeAreaTop: bannerSafeAreaTop,
    left: false,
    right: false,
    bottom: false,
  })

  const pinnedHubItems = useMemo(
    () =>
      mapHubItemsToPinnedEvents(
        Array.isArray(pinnedFeed?.pages) ? pinnedFeed.pages.flatMap((page) => page?.items ?? []) : [],
      ),
    [pinnedFeed?.pages],
  )

  const hasPinnedBannerContent = pinnedHubItems.length > 0

  const feedContentContainerStyle = useMemo(
    () => ({
      gap: getToken('$medium', 'space'),
      paddingTop: hasPinnedBannerContent && media.sm ? 0 : Platform.OS === 'ios' ? 8 : listSpacing.paddingTop,
    }),
    [hasPinnedBannerContent, listSpacing.paddingTop, media.sm],
  )

  const pinnedItemsUuids = useMemo(() => new Set(pinnedHubItems.map((item) => item.uuid)), [pinnedHubItems])

  const feedRows = useMemo(() => {
    const pages = Array.isArray(paginatedFeed?.pages) ? paginatedFeed.pages : []
    const items = pages.flatMap((page) => page?.items ?? [])
    const withoutPinned = excludeHubItemsByUuid(items, pinnedItemsUuids)
    const searched = filterHubItemsBySearch(withoutPinned, filters?.search ?? '')
    return filterRowsByItemType(mapHubItemsToFeedRows(searched), effectiveItemType)
  }, [paginatedFeed?.pages, pinnedItemsUuids, filters?.search, effectiveItemType])

  const hasActiveFilters = useMemo(
    () =>
      Boolean(filters?.search?.trim()) ||
      (activeTab === 'subscribed'
        ? Boolean(filters?.zone && filters.zone !== 'all')
        : Boolean(filters?.zone && filters.zone !== userAssembly)),
    [filters?.search, filters?.zone, userAssembly, activeTab],
  )

  const feedState = useMemo(
    () =>
      buildFeedState(feedRows, {
        activeTab,
        isFetching,
        search: filters?.search ?? '',
        zoneLabel: filters?.detailZone?.label,
      }),
    [feedRows, activeTab, isFetching, filters?.search, filters?.detailZone?.label],
  )

  const showSkeleton = isFetching || !filtersReady

  const handleManualRefresh = useCallback(() => {
    setIsManualRefreshing(true)
    void Promise.all([refetch(), queryClient.refetchQueries({ queryKey: hubKeys.all })]).finally(() => setIsManualRefreshing(false))
  }, [refetch, queryClient])

  const handleOpenOrganizeModal = useCallback(() => {
    openOrganiserModal(() => setOrganizeModalOpen(true))
  }, [openOrganiserModal])

  const handleCloseOrganizeModal = useCallback(() => {
    setOrganizeModalOpen(false)
  }, [])

  const handleSwitchToAllItems = useCallback(() => {
    setActiveTab('all')
    if (userAssembly) {
      setFiltersValue((prev) => ({ ...prev, zone: userAssembly, detailZone: getAssemblyDetailZone(userAssembly) }))
    }
  }, [setFiltersValue, userAssembly])

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

  return {
    media,
    isAuth,
    userData,
    organizeModalOpen,
    feedState,
    showSkeleton,
    feedContentContainerStyle,
    hasActiveFilters,
    hasNextPage: hasNextPage ?? false,
    isManualRefreshing,
    handleManualRefresh,
    loadMore,
    handleOpenOrganizeModal,
    handleCloseOrganizeModal,
    handleSwitchToAllItems,
    handleSwitchChange,
    pinnedBannerPaddingTop: pinnedBannerOuterSpacing.paddingTop,
    activeTab,
  }
}
