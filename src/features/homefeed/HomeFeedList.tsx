import { memo, useCallback, useRef, useMemo } from 'react'
import { FlatList } from 'react-native'
import { FeedCard } from '@/components/Cards'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import { transformFeedItemToProps } from '@/helpers/homeFeed'
import { useAlerts } from '@/services/alerts/hook'
import { useGetPaginatedFeed } from '@/services/timeline-feed/hook'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { useScrollToTop } from '@react-navigation/native'
import { useFocusEffect } from 'expo-router'
import { getToken, Spinner, useMedia, YStack, XStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import { Sparkle } from '@tamagui/lucide-icons'
import { VoxButton } from '@/components/Button'
import { Link } from 'expo-router'
import NotificationSubscribeCard from './components/NotificationSubscribeCard'
import { useShouldShowNotificationCard } from './hooks/useShouldShowNotificationCard'
import AlertStack from '@/components/Cards/AlertCard/components/AlertStack'
import Text from '@/components/base/Text'

const FeedCardMemoized = memo(FeedCard) as typeof FeedCard

const TimelineFeedCard = memo((item: RestTimelineFeedItem) => {
  const props = transformFeedItemToProps(item)
  return <FeedCardMemoized {...props} />
})

const HomeFeedList = () => {
  const media = useMedia()
  const shouldShowNotificationCard = useShouldShowNotificationCard()
  const { data: paginatedFeed, fetchNextPage, hasNextPage, ...feedQuery } = useGetPaginatedFeed()
  const { data: alerts, ...alertQuery } = useAlerts()
  const { hasFeature } = useGetExecutiveScopes()
  const feedData = paginatedFeed?.pages.map((page) => page?.hits ?? []).flat()

  const refetch = () => {
    feedQuery.refetch()
    alertQuery.refetch()
  }
  const isRefetching = feedQuery.isRefetching || alertQuery.isRefetching

  const loadMoreGeneric = () => {
    if (feedQuery.isRefetching) return
    if (hasNextPage) {
      fetchNextPage()
    }
  }
  useFocusEffect(
    useCallback(() => {
      alertQuery.refetch()
    }, []),
  )

  const loadMore = useDebouncedCallback(loadMoreGeneric, 1000, { leading: true, trailing: false })

  const { isWebPageLayoutScrollActive } = usePageLayoutScroll({
    onEndReached: loadMore,
    onEndReachedThreshold: 0.75,
  })
  const loadMoreNative = () => {
    if (isWebPageLayoutScrollActive) return
    loadMore()
  }

  const flatListRef = useRef<FlatList<RestTimelineFeedItem>>(null)
  useScrollToTop(flatListRef)

  const renderFeedItem = useCallback(({ item }: { item: RestTimelineFeedItem }) => {
    return <TimelineFeedCard {...item} />
  }, [])

  const header = useMemo(() => (
    alerts.length > 0 || shouldShowNotificationCard
      ? (
          <YStack gap={8} $gtSm={{ gap: 16, }}>
            {shouldShowNotificationCard ? <NotificationSubscribeCard /> : null}
            {alerts.length > 0 ? <AlertStack alerts={alerts} /> : null}
            {alerts.length > 0 && hasFeature('publications') ? (
              <XStack justifyContent="space-between" alignItems="center" px="$medium" $gtSm={{ px: 0 }}>
                <Text.MD color="$gray4" semibold>
                  Dernières actualités
                </Text.MD>
                {hasFeature('publications') && (
                  <Link href="/publications" asChild>
                    <VoxButton variant="soft" size="sm" theme="purple" iconLeft={Sparkle}>
                      Nouvelle publication
                    </VoxButton>
                  </Link>
                )}
              </XStack>
            ) : null}
          </YStack>
        )
      : null
  ), [alerts, shouldShowNotificationCard, hasFeature])

  return (
    <FlatList
      ref={flatListRef}
      style={{ flex: 1 }}
      scrollEnabled={!isWebPageLayoutScrollActive}
      contentContainerStyle={{
        gap: getToken('$medium', 'space'),
        paddingTop: media.gtSm ? getToken('$xxlarge', 'space') : undefined,
        paddingLeft: media.gtSm ? getToken('$xxlarge', 'space') : undefined,
        paddingRight: media.gtSm ? getToken('$xxlarge', 'space') : undefined,
        paddingBottom: getToken('$11', 'space'),
        justifyContent: 'space-around',
      }}
      ListHeaderComponent={header}
      data={feedData}
      renderItem={renderFeedItem}
      keyExtractor={(item) => item.objectID}
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      onEndReached={loadMoreNative}
      onEndReachedThreshold={0.5}
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
export default HomeFeedList
