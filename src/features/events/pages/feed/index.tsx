import React, { useMemo, useRef, useState } from 'react'
import { SectionList, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import Text from '@/components/base/Text'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import MyProfileCard from '@/components/ProfileCards/ProfileCard/MyProfileCard'
import ProfileLoginCTA from '@/components/ProfileCards/ProfileLoginCTA/ProfileLoginCTA'
import AuthFallbackWrapper from '@/components/Skeleton/AuthFallbackWrapper'
import StickyBox from '@/components/StickyBox/StickyBox'
import { useSession } from '@/ctx/SessionProvider'
import EventListItem from '@/features/events/components/EventListItem'
import { eventFiltersState } from '@/features/events/store/filterStore'
import { useSuspensePaginatedEvents } from '@/services/events/hook'
import { RestItemEvent, RestPublicItemEvent } from '@/services/events/schema'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { useScrollToTop } from '@react-navigation/native'
import { ChevronDown } from '@tamagui/lucide-icons'
import { isPast } from 'date-fns'
import { getToken, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { useDebounce, useDebouncedCallback } from 'use-debounce'
import { EmptyStateSection } from './components/EmptyStateSection'
import EventsHeader from './components/Header'
import EventsListSkeleton from './components/Skeleton'
import { useSyncScrollHeader } from './hooks/useSyncScrollHeader'

const splitEvents = (events: RestItemEvent[] | RestPublicItemEvent[]) => {
  const incomming: typeof events = []
  const past: typeof events = []
  events.forEach((event) => {
    if (isPast(event.finish_at ?? event.begin_at)) {
      past.push(event)
    } else {
      incomming.push(event)
    }
  })
  if (incomming.length === 0 && past.length === 0) {
    return []
  }

  return [
    { title: 'À venir', data: incomming, index: 0 },
    { title: 'passés', data: past, index: 1 },
  ]
}

const EventList = () => {
  const media = useMedia()
  const { session, isAuth } = useSession()
  const user = useGetSuspenseProfil({ enabled: Boolean(session) })
  const listRef = useRef<SectionList>(null)
  useScrollToTop(listRef)

  const [activeTab, setActiveTab] = useState<'events' | 'myEvents'>('events')

  const { value: _filters } = eventFiltersState()
  const [filters] = useDebounce(_filters, 300)

  const syncHeader = useSyncScrollHeader()

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
  const loadMoreGeneric = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const loadMore = useDebouncedCallback(loadMoreGeneric, 1000, { leading: true, trailing: false })

  const { isWebPageLayoutScrollActive } = usePageLayoutScroll({
    onEndReached: loadMore,
    onScroll: syncHeader.handleListScroll,
    onMomentumScrollEnd: syncHeader.handleMomentumScrollEnd,
    onEndReachedThreshold: 0.75,
  })

  const loadMoreNative = () => {
    if (isWebPageLayoutScrollActive) return
    loadMore()
  }

  const feedData = useMemo(() => {
    if (!paginatedFeed) return []
    return splitEvents(paginatedFeed.pages.flatMap((page) => page.items))
  }, [paginatedFeed])

  return (
    <>
      <PageLayout.SideBarLeft
        $gtSm={{
          paddingTop: '$xxlarge',
        }}
      >
        <StickyBox offsetTop="$xxlarge" offsetBottom="$medium">
          <YStack gap="$medium">
            <AuthFallbackWrapper fallback={<ProfileLoginCTA />} />
            <MyProfileCard />
          </YStack>
        </StickyBox>
      </PageLayout.SideBarLeft>
      <PageLayout.MainSingleColumn>
        <YStack gap="$medium" position="relative" flex={1}>
          <YStack flex={1}>
            {media.gtLg ? null : (
              <Animated.View style={[styles.header, syncHeader.headerAnimatedStyle]}>
                <EventsHeader mode="list" value={activeTab} onChange={setActiveTab} />
              </Animated.View>
            )}
            <SectionList
              ref={listRef}
              style={{ flex: 1 }}
              scrollEnabled={!isWebPageLayoutScrollActive}
              onScroll={syncHeader.handleListScroll}
              onMomentumScrollEnd={syncHeader.handleMomentumScrollEnd}
              scrollEventThrottle={16}
              stickySectionHeadersEnabled={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              removeClippedSubviews={true}
              contentContainerStyle={{
                gap: getToken('$medium', 'space'),
                paddingTop: media.gtLg ? getToken('$xlarge', 'space') : 155,
                paddingLeft: media.gtSm ? getToken('$xxlarge', 'space') : undefined,
                paddingRight: media.gtSm ? getToken('$xxlarge', 'space') : undefined,
                paddingBottom: getToken('$11', 'space'),
              }}
              sections={feedData}
              renderItem={({ item }) => <EventListItem event={item} userUuid={user.data?.uuid} />}
              renderSectionHeader={({ section }) => {
                return (
                  <YStack>
                    {section.data.length === 0 && !isFetching ? (
                      <EmptyStateSection isAuth={isAuth} />
                    ) : (
                      <XStack justifyContent="center">
                        <XStack gap="$small" $md={{ paddingLeft: '$medium' }} $gtLg={{ paddingVertical: section.index === 0 ? '$large' : 0 }}>
                          <Text.MD color={section.data.length === 0 ? '$textDisabled' : '$gray4'} semibold>
                            {activeTab === 'myEvents' ? 'MES ' : ''}
                            {`événements ${section.title}`.toUpperCase()}
                          </Text.MD>
                          <ChevronDown size={16} color="$textPrimary" />
                        </XStack>
                      </XStack>
                    )}
                  </YStack>
                )
              }}
              ListEmptyComponent={isFetching ? <EventsListSkeleton /> : feedData.length === 0 ? <EmptyStateSection isAuth={isAuth} /> : null}
              keyboardDismissMode="on-drag"
              keyExtractor={(item) => item.uuid}
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
          </YStack>
        </YStack>
      </PageLayout.MainSingleColumn>
      <PageLayout.SideBarRight
        $gtSm={{
          paddingTop: '$xxlarge',
        }}
      >
        <StickyBox offsetTop="$xxlarge" offsetBottom="$medium">
          <EventsHeader mode="aside" value={activeTab} onChange={setActiveTab} />
        </StickyBox>
      </PageLayout.SideBarRight>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    height: 200,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
})

const PageEvent = () => {
  return (
    <PageLayout webScrollable>
      <EventList />
    </PageLayout>
  )
}

export default PageEvent
