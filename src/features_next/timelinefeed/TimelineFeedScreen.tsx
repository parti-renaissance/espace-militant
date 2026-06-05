import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Platform, ViewToken } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import { Link } from 'expo-router'
import { getToken, ScrollView, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { Sparkle } from '@tamagui/lucide-icons'
import { useDebouncedCallback } from 'use-debounce'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import BoundarySuspenseWrapper, { DefaultErrorFallback } from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import { FeedCard } from '@/components/Cards'
import AlertStack from '@/components/Cards/AlertCard/components/AlertStack'
import AppDownloadCTA, { type AppDownloadCTASize } from '@/components/ProfileCards/AppDownloadCTA/AppDownloadCTA'
import { MyProfileCardNoLinks } from '@/components/ProfileCards/ProfileCard/MyProfileCard'
import Title from '@/components/Title/Title'
import TrackImpressionWeb from '@/components/TrackImpressionWeb'
import VoxCard from '@/components/VoxCard/VoxCard'
import { syncTimelinePostVideoVisibility } from '@/features_next/video/helpers/syncTimelinePostVideoVisibility'
import { useVideoFeedScreenFocus } from '@/features_next/video/hooks/useVideoFeedScreenFocus'

import { useSession } from '@/ctx/SessionProvider'
import { transformFeedItemToProps } from '@/helpers/homeFeed'
import { useAlerts } from '@/services/alerts/hook'
import { useHits } from '@/services/hits/hook'
import { useGetSuspenseExecutiveScopes } from '@/services/profile/hook'
import { useGetPaginatedFeed } from '@/services/timeline-feed/hook'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'
import { FEATURES } from '@/utils/Scopes'

import { HomeFeedMainSkeleton, HomeFeedSidebarSkeleton } from './components/HomeFeedSkeleton'
import NotificationSubscribeCard from './components/NotificationSubscribeCard'
import { useShouldShowNotificationCard } from './hooks/useShouldShowNotificationCard'

const FeedCardMemoized = memo(FeedCard) as typeof FeedCard

const TimelineFeedCard = memo((item: RestTimelineFeedItem) => {
  const props = transformFeedItemToProps(item)

  if (!props) return null

  if (Platform.OS === 'web' && props) {
    return (
      <TrackImpressionWeb objectType={item.type} objectId={item.objectID} source="page_timeline">
        <FeedCardMemoized {...props} />
      </TrackImpressionWeb>
    )
  }

  return <FeedCardMemoized {...props} />
})

const TimelineFeedMain = () => {
  useVideoFeedScreenFocus()

  const media = useMedia()
  const shouldShowNotificationCard = useShouldShowNotificationCard()
  const { data: paginatedFeed, fetchNextPage, hasNextPage, ...feedQuery } = useGetPaginatedFeed()
  const { data: alerts, ...alertQuery } = useAlerts()
  const { hasFeature } = useGetSuspenseExecutiveScopes()
  const { trackImpression } = useHits()

  const feedData = paginatedFeed?.pages.map((page) => page?.hits ?? []).flat()

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)
  const isRefetching = feedQuery.isRefetching || alertQuery.isRefetching

  useEffect(() => {
    if (!isRefetching) setIsManualRefreshing(false)
  }, [isRefetching])

  const handleManualRefresh = useCallback(() => {
    setIsManualRefreshing(true)
    feedQuery.refetch()
    alertQuery.refetch()
  }, [feedQuery, alertQuery])

  const loadMoreGeneric = () => {
    if (feedQuery.isRefetching) return
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

  const hasAlerts = useMemo(() => alerts.length > 0, [alerts.length])
  const hasPublications = useMemo(() => hasFeature(FEATURES.PUBLICATIONS), [hasFeature])
  const hasContentAboveTitle = shouldShowNotificationCard || hasAlerts

  const header = useMemo(
    () => (
      <YStack gap={media.sm ? 8 : 16}>
        {shouldShowNotificationCard ? <NotificationSubscribeCard /> : null}
        {hasAlerts ? <AlertStack alerts={alerts} /> : null}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          px={media.sm ? '$medium' : '$0'}
          pt={hasContentAboveTitle ? undefined : '$large'}
          flexWrap="wrap"
          gap="$medium"
        >
          <Title size="h1" aria-label="Des (bonnes) Nouvelles">
            <Title.Text>Des (bonnes)</Title.Text>
            <Title.Highlight>Nouvelles</Title.Highlight>
          </Title>
          {hasPublications ? (
            <Link href="/publications" asChild>
              <VoxButton variant="soft" size="sm" theme="pink" iconLeft={Sparkle}>
                Nouvelle publication
              </VoxButton>
            </Link>
          ) : null}
        </XStack>
      </YStack>
    ),
    [shouldShowNotificationCard, hasAlerts, hasPublications, hasContentAboveTitle, alerts, media.sm],
  )

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
              source: 'page_timeline',
            })
          }
        })
      }
    },
    [trackImpression],
  )

  const onViewableItemsChangedRef = useRef(onViewableItemsChanged)

  useEffect(() => {
    onViewableItemsChangedRef.current = onViewableItemsChanged
  }, [onViewableItemsChanged])

  const viewabilityConfigCallbackPairs = useMemo(
    () => [
      {
        viewabilityConfig: {
          viewAreaCoveragePercentThreshold: 50,
          minimumViewTime: 400,
        },
        onViewableItemsChanged: ({ viewableItems, changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
          onViewableItemsChangedRef.current({ viewableItems, changed })
        },
      },
    ],
    [],
  )

  return (
    <LayoutFlatList<RestTimelineFeedItem>
      ref={flatListRef}
      padding={media.sm ? false : 'left'}
      data={feedData}
      renderItem={renderFeedItem}
      keyExtractor={(item) => item.objectID}
      ListHeaderComponent={header}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
      refreshing={isManualRefreshing}
      onRefresh={handleManualRefresh}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      hasMore={hasNextPage ?? false}
      contentContainerStyle={{
        gap: getToken('$medium', 'space'),
      }}
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

const TimelineFeedScreen = () => {
  const media = useMedia()
  const { isAuth } = useSession()
  const appDownloadSize: AppDownloadCTASize = isAuth ? 'medium' : 'large'

  return (
    <>
      <Layout.Main>
        <BoundarySuspenseWrapper fallback={<HomeFeedMainSkeleton />}>
          <TimelineFeedMain />
        </BoundarySuspenseWrapper>
      </Layout.Main>

      {media.gtMd ? (
        <Layout.SideBar isSticky>
          <BoundarySuspenseWrapper
            fallback={<HomeFeedSidebarSkeleton />}
            errorChildren={(error) => (
              <YStack justifyContent="center" alignItems="center" gap="$medium">
                <VoxCard justifyContent="center" alignItems="center" flex={1} width="100%">
                  <VoxCard.Content justifyContent="center" alignItems="center">
                    <DefaultErrorFallback {...error} />
                  </VoxCard.Content>
                </VoxCard>
                <AppDownloadCTA size={appDownloadSize} />
              </YStack>
            )}
          >
            <ScrollView contentContainerStyle={{ height: '100dvh' }}>
              <YStack alignItems="center" justifyContent="center" gap="$medium">
                <MyProfileCardNoLinks />
                <AppDownloadCTA size={appDownloadSize} />
              </YStack>
            </ScrollView>
          </BoundarySuspenseWrapper>
        </Layout.SideBar>
      ) : null}
    </>
  )
}

export default TimelineFeedScreen
