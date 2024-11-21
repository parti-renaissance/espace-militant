import { useMemo, useRef } from 'react'
import { SectionList } from 'react-native'
import Text from '@/components/base/Text'
import EmptyEvent from '@/components/EmptyStates/EmptyEvent/EmptyEvent'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import { useSession } from '@/ctx/SessionProvider'
import { eventFiltersState } from '@/features/events/components/EventFilterForm/EventFilterForm'
import EventListItem from '@/features/events/components/EventListItem'
import { useSuspensePaginatedEvents } from '@/services/events/hook'
import { RestItemEvent, RestPublicItemEvent } from '@/services/events/schema'
import { useGetProfil } from '@/services/profile/hook'
import { useScrollToTop } from '@react-navigation/native'
import { ChevronDown } from '@tamagui/lucide-icons'
import { isPast } from 'date-fns'
import { getToken, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { useDebounce } from 'use-debounce'

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
    { title: 'Évènements passées', data: past, index: 1 },
  ]
}

const EventList = ({ activeTab }: { activeTab: 'events' | 'myEvents' }) => {
  const media = useMedia()
  const { session } = useSession()
  const user = useGetProfil({ enabled: Boolean(session) })
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
    postalCode: user.data?.postal_code,
    filters: {
      searchText: filters.search,
      zone: filters.zone,
      subscribedOnly: activeTab === 'myEvents',
    },
  })

  const feedData = useMemo(() => {
    if (!paginatedFeed) return []
    return splitEvents(paginatedFeed.pages.flatMap((page) => page.items))
  }, [paginatedFeed])

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  return (
    <SectionList
      style={{ width: '100%' }}
      ref={listRef}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{
        flexGrow: 1,
        gap: getToken('$medium', 'space'),
        paddingTop: 0,
        paddingLeft: media.gtSm ? getToken('$medium', 'space') : undefined,
        paddingRight: media.gtSm ? getToken('$medium', 'space') : undefined,
        paddingBottom: getToken('$11', 'space'),
      }}
      sections={feedData}
      renderItem={({ item }) => <EventListItem event={item} userUuid={user.data?.uuid} />}
      renderSectionHeader={({ section }) => {
        return (
          <XStack gap="$small" $md={{ paddingLeft: '$medium' }} $gtLg={{ paddingTop: section.index === 0 ? '$large' : 0 }}>
            <Text.MD color={section.data.length === 0 ? '$textDisabled' : '$gray4'} semibold>
              {`${section.title} ${section.index === 0 ? `(${section.data.length})` : ''}`.toUpperCase()}
            </Text.MD>
            <ChevronDown size={16} color="$textPrimary" />
          </XStack>
        )
      }}
      ListEmptyComponent={
        <PageLayout.StateFrame>
          <EmptyEvent state="évenements" />
        </PageLayout.StateFrame>
      }
      keyboardDismissMode="on-drag"
      keyExtractor={(item) => item.uuid}
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      onEndReached={loadMore}
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
