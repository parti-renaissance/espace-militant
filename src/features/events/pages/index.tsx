import { useMemo, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, SectionList } from 'react-native'
import Text from '@/components/base/Text'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useSession } from '@/ctx/SessionProvider'
import EmptyEvent from '@/features/events/components/EmptyEvent'
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
    { title: 'Événements passés', data: past, index: 1 },
  ]
}

const EventList = ({
  activeTab,
  onScroll,
  paddingTop,
  onMomentumScrollEnd,
}: {
  activeTab: 'events' | 'myEvents'
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  onMomentumScrollEnd?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  paddingTop?: number
}) => {
  const media = useMedia()
  const { session } = useSession()
  const user = useGetSuspenseProfil({ enabled: Boolean(session) })
  const listRef = useRef<SectionList>(null)
  useScrollToTop(listRef)

  const { value: _filters } = eventFiltersState()
  const [filters] = useDebounce(_filters, 300)

  const {
    data: paginatedFeed,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    refetch,
  } = useSuspensePaginatedEvents({
    filters: {
      searchText: filters.search,
      zone: filters.zone ?? user.data?.instances?.assembly?.code,
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
    <SectionList
      // style={{ width: '100%', flex: 1 }}
      ref={listRef}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      scrollEventThrottle={16}
      stickySectionHeadersEnabled={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      removeClippedSubviews={true}
      contentContainerStyle={{
        flexGrow: 1,
        gap: getToken('$medium', 'space'),
        paddingTop: paddingTop,
        paddingLeft: media.gtSm ? getToken('$medium', 'space') : undefined,
        paddingRight: media.gtSm ? getToken('$medium', 'space') : undefined,
        paddingBottom: getToken('$11', 'space'),
      }}
      sections={feedData}
      renderItem={({ item }) => <EventListItem event={item} userUuid={user.data?.uuid} />}
      renderSectionHeader={({ section }) => {
        return (
          <XStack justifyContent="center">
            <XStack gap="$small" $md={{ paddingLeft: '$medium' }} $gtLg={{ paddingTop: section.index === 0 ? '$large' : 0 }}>
              <Text.MD color={section.data.length === 0 ? '$textDisabled' : '$gray4'} semibold>
                {`${section.title}`.toUpperCase()}
              </Text.MD>
              <ChevronDown size={16} color="$textPrimary" />
            </XStack>
          </XStack>
        )
      }}
      ListEmptyComponent={
        <VoxCard.Content paddingTop="$xxlarge">
          <XStack flex={1}>
            <EmptyEvent state="évenements" />
          </XStack>
        </VoxCard.Content>
      }
      keyboardDismissMode="on-drag"
      keyExtractor={(item) => item.uuid}
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      scrollEnabled={!isWebPageLayoutScrollActive}
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

export default EventList
