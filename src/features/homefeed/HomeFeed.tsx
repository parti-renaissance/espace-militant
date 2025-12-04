import { memo, useCallback, useRef, useMemo, useState, useEffect } from 'react'
import { ViewToken, FlatList } from 'react-native'
import { FeedCard } from '@/components/Cards'
import { transformFeedItemToProps } from '@/helpers/homeFeed'
import { useAlerts } from '@/services/alerts/hook'
import { useGetPaginatedFeed } from '@/services/timeline-feed/hook'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'
import { useGetExecutiveScopes } from '@/services/profile/hook'
import { useScrollToTop } from '@react-navigation/native'
import { useFocusEffect } from 'expo-router'
import { getToken, Spinner, useMedia, YStack, XStack, ScrollView } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import { Sparkle } from '@tamagui/lucide-icons'
import { VoxButton } from '@/components/Button'
import { Link } from 'expo-router'
import NotificationSubscribeCard from './components/NotificationSubscribeCard'
import { useShouldShowNotificationCard } from './hooks/useShouldShowNotificationCard'
import AlertStack from '@/components/Cards/AlertCard/components/AlertStack'
import Text from '@/components/base/Text'
import { useHits } from '@/services/hits/hook'
import TrackImpressionWeb from '@/components/TrackImpressionWeb'
import { Platform } from 'react-native'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import AppDownloadCTA from '@/components/ProfileCards/AppDownloadCTA/AppDownloadCTA'
import { MyProfileCardNoLinks } from '@/components/ProfileCards/ProfileCard/MyProfileCard'

const FeedCardMemoized = memo(FeedCard) as typeof FeedCard

const TimelineFeedCard = memo((item: RestTimelineFeedItem) => {
  const props = transformFeedItemToProps(item)

  if (Platform.OS === 'web' && props) {
    return (
      <TrackImpressionWeb
        objectType={item.type}
        objectId={item.objectID}
        source="page_timeline"
      >
        <FeedCardMemoized {...props} />
      </TrackImpressionWeb>
    )
  }

  return <FeedCardMemoized {...props} />
})

const HomeFeed = () => {
  const media = useMedia()
  const shouldShowNotificationCard = useShouldShowNotificationCard()
  const { data: paginatedFeed, fetchNextPage, hasNextPage, ...feedQuery } = useGetPaginatedFeed()
  const { data: alerts, ...alertQuery } = useAlerts()
  const { hasFeature } = useGetExecutiveScopes()

  // ----------------------------------------------------
  // --- Zone de correction du bug onViewableItemsChanged ---
  // ----------------------------------------------------
  const { trackImpression } = useHits()

  // 1. Créer une référence pour la fonction de tracking (référence stable)
  const trackImpressionRef = useRef(trackImpression)

  // 2. Mettre à jour la référence à chaque rendu lorsque trackImpression change
  useEffect(() => {
    trackImpressionRef.current = trackImpression
  }, [trackImpression])
  // ----------------------------------------------------

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

  useFocusEffect(
    useCallback(() => {
      alertQuery.refetch()
    }, []),
  )

  const loadMore = useDebouncedCallback(loadMoreGeneric, 1000, { leading: true, trailing: false })

  const flatListRef = useRef<FlatList<RestTimelineFeedItem>>(null)
  useScrollToTop(flatListRef)

  const renderFeedItem = useCallback(({ item }: { item: RestTimelineFeedItem }) => {
    return <TimelineFeedCard {...item} />
  }, [])

  const header = useMemo(() => (
    alerts.length > 0 || shouldShowNotificationCard || hasFeature('publications')
      ? (
        <YStack gap={media.sm ? 8 : 16}>
          {shouldShowNotificationCard ? <NotificationSubscribeCard /> : null}
          {alerts.length > 0 ? <AlertStack alerts={alerts} /> : null}
          {alerts.length > 0 || hasFeature('publications') ? (
            <XStack justifyContent="space-between" alignItems="center" px={media.sm ? "$medium" : "$0"}>
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
  ), [alerts, shouldShowNotificationCard, hasFeature, media.sm])

  // 3. onViewableItemsChanged utilise la référence stable et a une dépendance vide
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (Platform.OS !== 'web') {
      viewableItems.forEach((viewToken) => {
        if (viewToken.isViewable && viewToken.item) {
          // Utilisation de la référence stable (.current) pour appeler la fonction la plus récente
          trackImpressionRef.current({
            object_type: viewToken.item.type,
            object_id: viewToken.item.objectID,
            source: 'page_timeline',
          })
        }
      })
    }
  }, []) // ⬅️ Liste de dépendances VIDE pour la stabilité

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 400,
  }), [])

  return (
    <>
      <Layout.Main>
        <LayoutFlatList<RestTimelineFeedItem>
          ref={flatListRef}
          padding="left"
          data={feedData}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.objectID}
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
        <Layout.SideBar isSticky>
          <ScrollView contentContainerStyle={{ height: '100dvh' }}>
            <YStack alignItems="center" justifyContent="center" gap="$medium">
              <MyProfileCardNoLinks />
              <AppDownloadCTA />
              
            </YStack>
          </ScrollView>
        </Layout.SideBar>
      ) : null
      }
    </>
  )
}

export default HomeFeed