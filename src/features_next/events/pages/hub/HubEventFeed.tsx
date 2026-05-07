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

const HubOrganizePromptCard = memo(function HubOrganizePromptCard(props: {
  bg: '$green2' | '$blue2'
  iconBubbleBg: '$green3' | '$blue3'
  icon: ReactNode
  title: string
}) {
  const { bg, iconBubbleBg, icon, title } = props
  const router = useRouter()
  const onPress = useCallback(() => {
    router.push(CREER_EVENEMENT_HREF)
  }, [router])

  return (
    <YStack
      gap="$small"
      bg={bg}
      p="$medium"
      borderRadius="$medium"
      flex={1}
      width="50%"
      cursor="pointer"
      onPress={onPress}
      hoverStyle={{ opacity: 0.94 }}
      pressStyle={{ opacity: 0.9 }}
    >
      <YStack bg={iconBubbleBg} borderRadius={99} height={44} width={44} alignItems="center" justifyContent="center">
        {icon}
      </YStack>
      <Text.MD semibold>{title}</Text.MD>
    </YStack>
  )
})

const HubOrganizePromptCards = memo(function HubOrganizePromptCards() {
  return (
    <XStack gap="$medium" px="$medium">
      <HubOrganizePromptCard bg="$green2" iconBubbleBg="$green3" icon={<Zap size={20} color="$green6" />} title="Organisez une action près de chez vous !" />
      <HubOrganizePromptCard bg="$blue2" iconBubbleBg="$blue3" icon={<Calendar size={20} color="$blue6" />} title="Organisez un événement !" />
    </XStack>
  )
})

const HubFooterResourceRow = memo(function HubFooterResourceRow(props: { href: Href; icon: ReactNode; title: string; description: string }) {
  const { href, icon, title, description } = props
  const router = useRouter()
  const onPress = useCallback(() => {
    router.push(href)
  }, [href, router])

  return (
    <YStack
      borderRadius="$medium"
      bg="$textOutline"
      p="$medium"
      width="100%"
      cursor="pointer"
      onPress={onPress}
      hoverStyle={{ opacity: 0.94 }}
      pressStyle={{ opacity: 0.9 }}
    >
      <XStack alignItems="center" gap="$medium">
        <YStack bg="$gray2" borderRadius={99} height={44} width={44} alignItems="center" justifyContent="center">
          {icon}
        </YStack>
        <YStack flex={1} gap="$small">
          <Text.MD semibold>{title}</Text.MD>
          <Text.SM secondary>{description}</Text.SM>
        </YStack>
        <YStack justifyContent="center">
          <ChevronRight size={24} color="$textSecondary" />
        </YStack>
      </XStack>
    </YStack>
  )
})

const HubFooterResourceCards = memo(function HubFooterResourceCards() {
  return (
    <>
      <HubFooterResourceRow
        href="/questionnaires"
        icon={<ClipboardCheck size={20} color="$gray5" />}
        title="Questionnaires de terrain"
        description="Allez à la rencontre de nos électeurs, sur les marchés, dans la rue ou en porte à porte. "
      />
      <HubFooterResourceRow
        href="/old/porte-a-porte"
        icon={<DoorOpen size={20} color="$gray5" />}
        title="Porte-à-porte"
        description="Consultez la carte des adresses prioritaires pour organiser votre porte-à-porte."
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
