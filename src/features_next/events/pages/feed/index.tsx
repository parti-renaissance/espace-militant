import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Platform, ViewToken } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import { getToken, Spinner, useMedia, YStack } from 'tamagui'
import { useDebounce, useDebouncedCallback } from 'use-debounce'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import TrackImpressionWeb from '@/components/TrackImpressionWeb'
import EventListItem from '@/features_next/events/components/EventListItem'
import { eventFiltersState } from '@/features_next/events/store/filterStore'
import { groupEventsBySection } from '@/features_next/events/utils'

import { useSession } from '@/ctx/SessionProvider'
import { useSuspensePaginatedEvents } from '@/services/events/hook'
import { RestItemEvent, RestPublicItemEvent } from '@/services/events/schema'
import { useHits } from '@/services/hits/hook'
import { useGetProfil } from '@/services/profile/hook'

import type { EmptyStateReason } from './components/EmptyStateSection'
import { EmptyStateSection } from './components/EmptyStateSection'
import EventsHeader from './components/Header'
import { EventSectionHeader } from './components/SectionHeader'
import EventsListSkeleton from './components/Skeleton'

type FeedListItem =
  | { type: 'header'; sectionId: string; title: string }
  | { type: 'event'; event: RestItemEvent | RestPublicItemEvent }
  | { type: 'empty_state'; reason: EmptyStateReason }

const EventCard = memo(({ event, userUuid, source }: { event: RestItemEvent | RestPublicItemEvent; userUuid?: string; source: string }) => {
  if (Platform.OS === 'web') {
    return (
      <TrackImpressionWeb objectType="event" objectId={event.uuid} source={source}>
        <EventListItem event={event} userUuid={userUuid} source={source} />
      </TrackImpressionWeb>
    )
  }

  return <EventListItem event={event} userUuid={userUuid} source={source} />
})

const EventFeed = () => {
  const media = useMedia()
  const { session } = useSession()
  const user = useGetProfil({ enabled: Boolean(session) })

  const [activeTab, setActiveTab] = useState<'events' | 'myEvents'>('events')

  const { value: _filters } = eventFiltersState()
  const [filters] = useDebounce(_filters, 300)

  // Impression tracking avec pattern stable
  const { trackImpression } = useHits()
  const trackImpressionRef = useRef(trackImpression)

  useEffect(() => {
    trackImpressionRef.current = trackImpression
  }, [trackImpression])

  const {
    data: paginatedFeed,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isFetching,
    refetch,
  } = useSuspensePaginatedEvents({
    filters: {
      searchText: filters.search,
      zone: filters.zone,
      subscribedOnly: activeTab === 'myEvents',
    },
  })

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  useEffect(() => {
    if (!isRefetching) setIsManualRefreshing(false)
  }, [isRefetching])

  const handleManualRefresh = useCallback(() => {
    setIsManualRefreshing(true)
    refetch()
  }, [refetch])

  const loadMoreGeneric = () => {
    if (isRefetching) return
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const loadMore = useDebouncedCallback(loadMoreGeneric, 1000, { leading: true, trailing: false })

  const feedData = useMemo(() => {
    if (!paginatedFeed) return []
    return paginatedFeed.pages.flatMap((page) => page.items)
  }, [paginatedFeed])

  const emptyStateReason = useMemo((): EmptyStateReason | null => {
    if (isFetching && feedData.length === 0) return null
    if (feedData.length === 0) {
      if (filters.search.trim()) return { kind: 'search_no_results', search: filters.search }
      if (activeTab === 'myEvents') return { kind: 'subscriptions_empty' }
      const zoneLabel = filters.detailZone?.label
      if (zoneLabel && zoneLabel !== 'Toutes') return { kind: 'zone_no_upcoming', zoneLabel }
      return { kind: 'generic' }
    }
    const zoneLabel = filters.detailZone?.label
    const sections = groupEventsBySection(feedData, { zoneLabel })
    const hasUpcomingEvents = sections.some((s) => s.id !== 'past' && s.data.length > 0)
    const hasOnlyPastEvents =
      !hasUpcomingEvents && sections.some((s) => s.id === 'past' && s.data.length > 0)
    if (hasOnlyPastEvents && (filters.search.trim() || activeTab === 'myEvents')) {
      return activeTab === 'myEvents'
        ? { kind: 'subscriptions_no_upcoming' }
        : { kind: 'search_no_upcoming', search: filters.search.trim() || undefined }
    }
    const zoneSection = sections.find((s) => s.id === 'zone')
    if (zoneSection && zoneSection.data.length === 0 && zoneLabel && zoneLabel !== 'Toutes') {
      return { kind: 'zone_no_upcoming', zoneLabel }
    }
    return null
  }, [feedData, filters.detailZone?.label, filters.search, activeTab, isFetching])

  const hasActiveFilters = Boolean(
    filters.search.trim() || (filters.zone && filters.zone !== user.data?.instances?.assembly?.code),
  )

  const sectionedData = useMemo((): FeedListItem[] => {
    if (isFetching && feedData.length === 0) return []
    if (filters.search.trim() && feedData.length === 0) return []

    const zoneLabel = filters.detailZone?.label
    const sections = groupEventsBySection(feedData, { zoneLabel })
    const hasUpcomingEvents = sections.some((s) => s.id !== 'past' && s.data.length > 0)
    const hasOnlyPastEvents =
      !hasUpcomingEvents && sections.some((s) => s.id === 'past' && s.data.length > 0)
    const showEmptyUpcoming =
      hasOnlyPastEvents && (filters.search.trim() || activeTab === 'myEvents')

    const emptyStateItem: FeedListItem[] =
      showEmptyUpcoming && emptyStateReason
        ? [{ type: 'empty_state', reason: emptyStateReason }]
        : []

    const listItems = sections.flatMap((section): FeedListItem[] => {
      if (section.id === 'zone' && section.data.length === 0 && zoneLabel) {
        if (emptyStateReason?.kind === 'zone_no_upcoming') {
          return [{ type: 'empty_state', reason: emptyStateReason }]
        }
        return []
      }
      return [
        { type: 'header', sectionId: section.id, title: section.title },
        ...section.data.map((event) => ({ type: 'event' as const, event })),
      ]
    })

    if (showEmptyUpcoming) {
      return [...emptyStateItem, ...listItems]
    }
    return [...listItems]
  }, [feedData, filters.detailZone?.label, filters.search, activeTab, isFetching, emptyStateReason])

  const flatListRef = useRef<FlatList<FeedListItem>>(null)
  useScrollToTop(flatListRef)

  const handleSwitchToAllEvents = useCallback(() => setActiveTab('events'), [])

  const renderItem = useCallback(
    ({ item }: { item: FeedListItem }) => {
      if (item.type === 'header') {
        return <EventSectionHeader title={item.title} />
      }
      if (item.type === 'empty_state') {
        return (
          <EmptyStateSection
            reason={item.reason}
            onSwitchToAllEvents={handleSwitchToAllEvents}
            showResetButton={hasActiveFilters}
          />
        )
      }
      return <EventCard event={item.event} userUuid={user.data?.uuid} source="page_events" />
    },
    [user.data?.uuid, hasActiveFilters, handleSwitchToAllEvents],
  )

  const header = useMemo(() => (media.gtMd ? null : <EventsHeader mode="compact" value={activeTab} onChange={setActiveTab} />), [activeTab, media.gtMd])

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (Platform.OS !== 'web') {
      viewableItems.forEach((viewToken) => {
        if (viewToken.isViewable && viewToken.item && viewToken.item.type === 'event') {
          trackImpressionRef.current({
            object_type: 'event',
            object_id: viewToken.item.event.uuid,
            source: 'page_events',
          })
        }
      })
    }
  }, [])

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
      minimumViewTime: 400,
    }),
    [],
  )

  return (
    <>
      <Layout.Main>
        <LayoutFlatList<FeedListItem>
          ref={flatListRef}
          padding="left"
          data={sectionedData}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.type === 'header'
              ? `header-${item.sectionId}`
              : item.type === 'empty_state'
                ? `empty-state-${item.reason.kind}`
                : item.event.uuid
          }
          ListHeaderComponent={header}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          refreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          hasMore={hasNextPage ?? false}
          contentContainerStyle={{
            gap: getToken('$medium', 'space'),
          }}
          ListEmptyComponent={
            isFetching ? (
              <EventsListSkeleton />
            ) : (
              <EmptyStateSection
                reason={emptyStateReason ?? { kind: 'generic' }}
                onSwitchToAllEvents={handleSwitchToAllEvents}
                showResetButton={hasActiveFilters}
              />
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
            <EventsHeader mode="aside" value={activeTab} onChange={setActiveTab} />
          </YStack>
        </Layout.SideBar>
      ) : null}
    </>
  )
}

export default EventFeed
