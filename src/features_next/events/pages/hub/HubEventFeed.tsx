/**
 * Liste minimaliste du hub : bannière épinglée + inscriptions à venir uniquement.
 */
import type { ReactNode } from 'react'
import { memo, Suspense, useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, Platform } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import type { Href } from 'expo-router'
import { useRouter } from 'expo-router'
import { getToken, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { Calendar, CalendarCheck2, ChevronRight, ClipboardCheck, DoorOpen, Zap } from '@tamagui/lucide-icons'

import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import Text from '@/components/base/Text'
import TrackImpressionWeb from '@/components/TrackImpressionWeb'
import EventListItem from '@/features_next/events/components/EventListItem'
import { PinnedEventBanner } from '@/features_next/events/pages/feed/components/PinnedEventBanner'

import { useSession } from '@/ctx/SessionProvider'
import { useSuspensePaginatedEvents } from '@/services/events/hook'
import { RestItemEvent, RestPublicItemEvent } from '@/services/events/schema'
import { useGetProfil } from '@/services/profile/hook'

import { EmptyStateSection } from '../feed/components/EmptyStateSection'
import EventsListSkeleton from '../feed/components/Skeleton'
import { ButtonCard } from './ButtonCard'

type HubEventRow = RestItemEvent | RestPublicItemEvent

const EventRow = memo(({ event, userUuid }: { event: HubEventRow; userUuid?: string }) => {
  const media = useMedia()
  const row = <EventListItem event={event} userUuid={userUuid} source="page_events" />
  if (Platform.OS === 'web') {
    return (
      <YStack px={media.gtSm ? '$medium' : 0}>
        <TrackImpressionWeb objectType="event" objectId={event.uuid} source="page_events">
          {row}
        </TrackImpressionWeb>
      </YStack>
    )
  }
  return <YStack px={media.gtSm ? '$medium' : 0}>{row}</YStack>
})

const CREER_EVENEMENT_HREF = '/evenements/creer' as const satisfies Href

const HubOrganizePromptCards = memo(function HubOrganizePromptCards() {
  return (
    <XStack gap="$medium" px="$medium">
      <YStack width="50%" flex={1}>
        <ButtonCard theme="green" icon={Zap} label="Organisez une action près de chez vous" href={CREER_EVENEMENT_HREF} />
      </YStack>
      <YStack width="50%" flex={1}>
        <ButtonCard theme="blue" icon={Calendar} label="Organisez un événement" href={CREER_EVENEMENT_HREF} />
      </YStack>
    </XStack>
  )
})

const HubFooterResourceCards = memo(function HubFooterResourceCards() {
  return (
    <>
      <ButtonCard
        horizontal
        icon={ClipboardCheck}
        rightIcon={ChevronRight}
        label="Questionnaires de terrain"
        description="Allez à la rencontre de nos électeurs, sur les marchés, dans la rue ou en porte à porte."
        href="/questionnaires"
      />
      <ButtonCard
        horizontal
        icon={DoorOpen}
        rightIcon={ChevronRight}
        label="Porte-à-porte"
        description="Consultez la carte des adresses prioritaires pour organiser votre porte-à-porte."
        href="/old/porte-a-porte"
      />
    </>
  )
})

type HubEventFeedProps = {
  /** Carte hub en tête du scroll (mobile) — doit avoir une hauteur fixe. */
  embeddedMapHeader?: ReactNode
  /** Marge sous le contenu pour la tab bar + safe area. */
  listContentInsetBottom?: number
}

const HubEventFeed = (props: HubEventFeedProps) => {
  const { embeddedMapHeader, listContentInsetBottom = 0 } = props
  const { session, isAuth } = useSession()
  const { data: userData } = useGetProfil({ enabled: Boolean(session) })
  const filtersReady = !isAuth || userData !== undefined

  const futureEventsThreshold = useMemo(() => new Date(), [])

  const { data, fetchNextPage, hasNextPage, isRefetching, isFetching } = useSuspensePaginatedEvents({
    filters: { subscribedOnly: true, finishAfter: futureEventsThreshold },
    enabled: filtersReady && isAuth,
  })

  const events = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data?.pages])

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isRefetching) void fetchNextPage()
  }, [fetchNextPage, hasNextPage, isRefetching])

  const showSkeleton = !filtersReady || (isFetching && events.length === 0)

  const listRef = useRef<FlatList<HubEventRow>>(null)
  useScrollToTop(listRef)

  const listHeader = (
    <YStack pt="$medium" gap={24}>
      <Suspense fallback={null}>
        <PinnedEventBanner small={true} />
      </Suspense>
      <HubOrganizePromptCards />
      <XStack gap="$small" px="$medium">
        <CalendarCheck2 size={16} color="$blue5" />
        <Text.MD semibold>Mon agenda</Text.MD>
      </XStack>
    </YStack>
  )

  const listHeaderComponent =
    embeddedMapHeader != null ? (
      <>
        {embeddedMapHeader}
        {listHeader}
      </>
    ) : (
      listHeader
    )

  const contentContainerStyleMerged = useMemo(
    () => ({
      gap: getToken('$medium', 'space'),
      ...(listContentInsetBottom > 0 ? { paddingBottom: listContentInsetBottom } : {}),
    }),
    [listContentInsetBottom],
  )

  return (
    <YStack flex={1} width="100%" minHeight={0} bg="$textSurface">
      <LayoutFlatList<HubEventRow>
        ref={listRef}
        padding={false}
        data={events}
        keyExtractor={(e) => e.uuid}
        renderItem={({ item }) => <EventRow event={item} userUuid={userData?.uuid} />}
        ListHeaderComponent={listHeaderComponent}
        contentContainerStyle={contentContainerStyleMerged}
        removeClippedSubviews={embeddedMapHeader != null && Platform.OS !== 'web' ? false : undefined}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        hasMore={hasNextPage ?? false}
        ListEmptyComponent={showSkeleton ? <EventsListSkeleton /> : <EmptyStateSection reason={{ kind: 'agenda_empty' }} showResetButton={false} />}
        ListFooterComponent={
          <YStack>
            {hasNextPage ? (
              <YStack padding="$medium" alignItems="center">
                <Spinner size="large" />
              </YStack>
            ) : null}
            <YStack px="$medium" pb="$medium" pt="$small" alignItems="center" gap="$medium">
              <HubFooterResourceCards />
            </YStack>
          </YStack>
        }
      />
    </YStack>
  )
}

export default HubEventFeed
