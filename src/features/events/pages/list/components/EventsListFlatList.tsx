import { useEffect, useRef, type ReactElement } from 'react'
import { FlatList, Platform, ViewToken } from 'react-native'
import { useScrollToTop } from 'expo-router/react-navigation'
import { Spinner, YStack } from 'tamagui'

import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import type { EmptyStateReason } from '@/features/events/components/feed-layout/EmptyStateSection'
import { EmptyStateSection } from '@/features/events/components/feed-layout/EmptyStateSection'
import HubListSkeleton from '@/features/events/components/feed-layout/HubListSkeleton'
import { FeedSectionHeader } from '@/features/events/components/feed-layout/SectionHeader'
import { HubFeedRow } from '@/features/events/components/list-item/HubFeedRow'

import { HIT_SOURCES } from '@/services/hits/constants'
import { useHits } from '@/services/hits/hook'
import type { RestProfilResponse } from '@/services/profile/schema'

import { FEED_VIEWABILITY_CONFIG } from '../helpers/constants'
import type { FeedListItem } from '../types'

type EventsListFlatListProps = {
  data: FeedListItem[]
  emptyReason: EmptyStateReason
  feedContentContainerStyle: { gap: number | undefined; paddingTop: number | undefined }
  hasActiveFilters: boolean
  hasNextPage: boolean
  isManualRefreshing: boolean
  listHeader: ReactElement
  onLoadMore: () => void
  onManualRefresh: () => void
  onSwitchToAllItems: () => void
  showSkeleton: boolean
  userData?: RestProfilResponse
}

export function EventsListFlatList({
  data,
  emptyReason,
  feedContentContainerStyle,
  hasActiveFilters,
  hasNextPage,
  isManualRefreshing,
  listHeader,
  onLoadMore,
  onManualRefresh,
  onSwitchToAllItems,
  showSkeleton,
  userData,
}: EventsListFlatListProps) {
  const { trackImpression } = useHits()

  const trackImpressionRef = useRef(trackImpression)
  useEffect(() => {
    trackImpressionRef.current = trackImpression
  }, [trackImpression])

  const flatListRef = useRef<FlatList<FeedListItem>>(null)
  useScrollToTop(flatListRef)

  const renderItem = ({ item }: { item: FeedListItem }) => {
    switch (item.type) {
      case 'header':
        return <FeedSectionHeader title={item.title} />
      case 'empty_state':
        return (
          <YStack py="$large">
            <EmptyStateSection reason={item.reason} onSwitchToAllItems={onSwitchToAllItems} showResetButton={hasActiveFilters} />
          </YStack>
        )
      case 'hub_row':
        return <HubFeedRow row={item.row} userUuid={userData?.uuid} source={HIT_SOURCES.PAGE_EVENTS} />
      default:
        return null
    }
  }

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (Platform.OS === 'web') return
    viewableItems.forEach((viewToken) => {
      if (viewToken.isViewable && viewToken.item?.type === 'hub_row') {
        const row = viewToken.item.row
        if (row.type === 'event') {
          trackImpressionRef.current({
            object_type: 'event',
            object_id: row.event.uuid,
            source: HIT_SOURCES.PAGE_EVENTS,
          })
        } else if (row.payload.id) {
          trackImpressionRef.current({
            object_type: 'action',
            object_id: row.payload.id,
            source: HIT_SOURCES.PAGE_EVENTS,
          })
        }
      }
    })
  }

  return (
    <LayoutFlatList<FeedListItem>
      ref={flatListRef}
      padding="left"
      data={data}
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
      onRefresh={onManualRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      hasMore={hasNextPage ?? false}
      contentContainerStyle={feedContentContainerStyle}
      removeClippedSubviews={Platform.OS === 'android'}
      windowSize={6}
      initialNumToRender={4}
      maxToRenderPerBatch={9}
      ListEmptyComponent={
        showSkeleton ? (
          <HubListSkeleton />
        ) : (
          <YStack py="$large">
            <EmptyStateSection reason={emptyReason} onSwitchToAllItems={onSwitchToAllItems} showResetButton={hasActiveFilters} />
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
  )
}
