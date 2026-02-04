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

import { useSession } from '@/ctx/SessionProvider'
import { useSuspensePaginatedEvents } from '@/services/events/hook'
import { RestItemEvent, RestPublicItemEvent } from '@/services/events/schema'
import { useHits } from '@/services/hits/hook'
import { useGetProfil } from '@/services/profile/hook'

import { EmptyStateSection } from './components/EmptyStateSection'
import EventsHeader from './components/Header'
import EventsListSkeleton from './components/Skeleton'

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
  const { session, isAuth } = useSession()
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

  const flatListRef = useRef<FlatList<RestItemEvent | RestPublicItemEvent>>(null)
  useScrollToTop(flatListRef)

  const renderEventItem = useCallback(
    ({ item }: { item: RestItemEvent | RestPublicItemEvent }) => {
      return <EventCard event={item} userUuid={user.data?.uuid} source="page_events" />
    },
    [user.data?.uuid],
  )

  const header = useMemo(() => (media.gtMd ? null : <EventsHeader mode="compact" value={activeTab} onChange={setActiveTab} />), [activeTab, media.gtMd])

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (Platform.OS !== 'web') {
      viewableItems.forEach((viewToken) => {
        if (viewToken.isViewable && viewToken.item) {
          trackImpressionRef.current({
            object_type: 'event',
            object_id: viewToken.item.uuid,
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
        <LayoutFlatList<RestItemEvent | RestPublicItemEvent>
          ref={flatListRef}
          padding="left"
          data={feedData}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.uuid}
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
          ListEmptyComponent={isFetching ? <EventsListSkeleton /> : <EmptyStateSection isAuth={isAuth} />}
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
