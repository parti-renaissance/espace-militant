import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { FlatList, Platform, ViewToken } from 'react-native'
import { useScrollToTop } from 'expo-router/react-navigation'
import { getToken, Spinner, useMedia, YStack } from 'tamagui'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'

import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import { TimelineFeedCard } from './TimelineFeedCard'
import {
  onTimelineViewableItemsChanged,
  TIMELINE_VIEWABILITY_CONFIG,
  timelineViewabilityCallbackRef,
} from '../helpers/timelineViewability'
import { syncTimelinePostVideoVisibility } from '@/features_next/video/helpers/syncTimelinePostVideoVisibility'
import { useVideoFeedScreenFocus } from '@/features_next/video/hooks/useVideoFeedScreenFocus'

import { ALERTS_QUERY_KEY } from '@/services/alerts/hook'
import { HIT_SOURCES } from '@/services/hits/constants'
import { useHits } from '@/services/hits/hook'
import { useGetPaginatedFeed } from '@/services/timeline-feed/hook'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'

type TimelineFeedListProps = {
  feedData: RestTimelineFeedItem[]
  fetchNextPage: ReturnType<typeof useGetPaginatedFeed>['fetchNextPage']
  hasNextPage: boolean
  isFetchingNextPage: boolean
  feedQuery: Omit<ReturnType<typeof useGetPaginatedFeed>, 'data' | 'fetchNextPage' | 'hasNextPage' | 'isFetchingNextPage'>
  header: ReactElement
}

export function TimelineFeedList({
  feedData,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  feedQuery,
  header,
}: TimelineFeedListProps) {
  useVideoFeedScreenFocus()

  const media = useMedia()
  const queryClient = useQueryClient()
  const { trackImpression } = useHits()
  const alertsRefetching = useIsFetching({ queryKey: [ALERTS_QUERY_KEY] }) > 0

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)
  const isRefetching = feedQuery.isRefetching || alertsRefetching

  useEffect(() => {
    if (!isRefetching) setIsManualRefreshing(false)
  }, [isRefetching])

  const handleManualRefresh = useCallback(() => {
    setIsManualRefreshing(true)
    feedQuery.refetch()
    queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] })
  }, [feedQuery, queryClient])

  const loadMoreGeneric = () => {
    if (feedQuery.isRefetching || isFetchingNextPage) return
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const loadMore = useDebouncedCallback(loadMoreGeneric, 1000, { leading: true, trailing: false })

  const flatListRef = useRef<FlatList<RestTimelineFeedItem>>(null)
  useScrollToTop(flatListRef)

  const renderFeedItem = useCallback(({ item }: { item: RestTimelineFeedItem }) => {
    return <TimelineFeedCard {...item} />
  }, [])

  const onViewableItemsChanged = useCallback(
    ({ viewableItems, changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      syncTimelinePostVideoVisibility({
        viewableItems: viewableItems as ViewToken<RestTimelineFeedItem>[],
        changed: changed as ViewToken<RestTimelineFeedItem>[],
      })

      if (Platform.OS !== 'web') {
        viewableItems.forEach((viewToken) => {
          if (viewToken.isViewable && viewToken.item) {
            trackImpression({
              object_type: viewToken.item.type,
              object_id: viewToken.item.objectID,
              source: HIT_SOURCES.PAGE_TIMELINE,
            })
          }
        })
      }
    },
    [trackImpression],
  )

  useEffect(() => {
    timelineViewabilityCallbackRef.current = onViewableItemsChanged
  }, [onViewableItemsChanged])

  return (
    <LayoutFlatList<RestTimelineFeedItem>
      ref={flatListRef}
      padding={media.sm ? false : 'left'}
      data={feedData}
      renderItem={renderFeedItem}
      keyExtractor={(item) => item.objectID}
      ListHeaderComponent={header}
      onViewableItemsChanged={onTimelineViewableItemsChanged}
      viewabilityConfig={TIMELINE_VIEWABILITY_CONFIG}
      refreshing={isManualRefreshing}
      onRefresh={handleManualRefresh}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      hasMore={hasNextPage ?? false}
      contentContainerStyle={{
        gap: getToken('$medium', 'space'),
      }}
      windowSize={6}
      initialNumToRender={4}
      maxToRenderPerBatch={9}
      ListFooterComponent={
        isFetchingNextPage ? (
          <YStack p="$medium" pb="$large">
            <Spinner size="large" />
          </YStack>
        ) : null
      }
    />
  )
}
