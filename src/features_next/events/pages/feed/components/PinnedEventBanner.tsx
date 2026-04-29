import { memo, useMemo, type ReactNode } from 'react'
import { Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { Href, useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import { CalendarDays, MapPin, Pin, Video } from '@tamagui/lucide-icons'
import { formatInTimeZone } from 'date-fns-tz'
import { fr } from 'date-fns/locale'

import useLayoutSpacing from '@/components/AppStructure/hooks/useLayoutSpacing'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { getEventItemImageFallback, isEventPartial } from '@/features_next/events/utils'

import { useSession } from '@/ctx/SessionProvider'
import { useSuspensePinnedEvents } from '@/services/events/hook'
import type { RestItemEvent, RestPublicItemEvent } from '@/services/events/schema'

import { FadingScrollView } from './FadingScrollView'

type PinnedEventItem = RestItemEvent | RestPublicItemEvent

type CardSizeMode = 'scroll' | 'split' | 'single'

const SECONDARY_ICON_COLOR = '$textSecondary' as const

function formatPinnedBannerDate(iso: string, timeZone: string) {
  return formatInTimeZone(new Date(iso), timeZone || 'Europe/Paris', 'd MMMM, HH:mm', { locale: fr })
}

function formatPinnedBannerLocation(address: PinnedEventItem['post_address']) {
  if (!address) return null
  const street = address.address?.trim() || null
  const city = (address.city_name ?? address.city)?.trim() || null
  if (!street && !city) return null
  return [street, city].filter(Boolean).join(' - ')
}

function PinnedEventCardContent({ event }: { event: PinnedEventItem }) {
  const locationLine = formatPinnedBannerLocation(event.post_address)
  const fallbackImage = getEventItemImageFallback(event)

  return (
    <XStack gap="$small" alignItems="flex-start">
      {fallbackImage ? (
        <Image
          source={typeof fallbackImage === 'string' ? { uri: fallbackImage } : fallbackImage}
          contentFit="cover"
          style={{ width: 64, height: 64, borderRadius: 8 }}
        />
      ) : (
        <YStack width={64} height={64} borderRadius={8} backgroundColor="$gray1" justifyContent="center" alignItems="center">
          <Pin size={24} color="$blue6" />
        </YStack>
      )}
      <YStack gap={8} flex={1} minWidth={0} pt={4}>
        <Text.LG semibold numberOfLines={1}>
          {event.name}
        </Text.LG>
        <YStack gap={4}>
          {event.begin_at ? (
            <XStack gap="$small" alignItems="center">
              <CalendarDays size={14} color={SECONDARY_ICON_COLOR} />
              <Text.SM secondary flexShrink={1} numberOfLines={1}>
                {formatPinnedBannerDate(event.begin_at, event.time_zone)}
              </Text.SM>
            </XStack>
          ) : null}
          {event.mode === 'online' ? (
            <XStack gap="$small" alignItems="center">
              <Video size={14} color={SECONDARY_ICON_COLOR} />
              <Text.SM secondary flexShrink={1} numberOfLines={1}>
                Visioconférence
              </Text.SM>
            </XStack>
          ) : locationLine ? (
            <XStack gap="$small" alignItems="center">
              <MapPin size={14} color={SECONDARY_ICON_COLOR} />
              <Text.SM secondary flexShrink={1} numberOfLines={1}>
                {locationLine}
              </Text.SM>
            </XStack>
          ) : null}
        </YStack>
      </YStack>
    </XStack>
  )
}

function PinnedEventCardWrapper({ sizeMode, isMobile, children }: { sizeMode: CardSizeMode; isMobile: boolean; children: ReactNode }) {
  if (sizeMode === 'split') {
    return (
      <YStack flex={1} flexBasis={0} minWidth={0} height={90}>
        {children}
      </YStack>
    )
  }

  if (sizeMode === 'single') {
    return (
      <YStack width="100%" maxWidth={520} height={90}>
        {children}
      </YStack>
    )
  }

  return (
    <YStack flexShrink={0} maxWidth={520} minWidth={isMobile ? undefined : 320} width={isMobile ? Dimensions.get('window').width * 0.8 : 350} height={90}>
      {children}
    </YStack>
  )
}

const PinnedEventCard = memo(
  ({ event, sizeMode, isMobile }: { event: PinnedEventItem; sizeMode: CardSizeMode; isMobile: boolean }) => {
    const router = useRouter()
    const href = `/evenements/${event.slug}?source=page_events_pinned` as Href

    return (
      <PinnedEventCardWrapper sizeMode={sizeMode} isMobile={isMobile}>
        <YStack position="relative" flex={1} borderRadius="$medium" overflow="hidden">
          <VoxCard
            cursor="pointer"
            flex={1}
            width={sizeMode === 'split' ? '100%' : undefined}
            onPress={() => router.push(href)}
            borderRadius="$medium"
            hoverStyle={{
              backgroundColor: '$textSurface',
            }}
            pressStyle={{
              backgroundColor: '$textSurface',
            }}
          >
            <VoxCard.Content gap="$small" padding={12}>
              <PinnedEventCardContent event={event} />
            </VoxCard.Content>
          </VoxCard>
        </YStack>
      </PinnedEventCardWrapper>
    )
  },
)

PinnedEventCard.displayName = 'PinnedEventCard'

type PinnedEventBannerProps = {
  /**
   * Applique le safe area top (défaut `true`).
   * À désactiver (`false`) lorsque le banner est rendu dans un ScrollView/FlatList qui
   * gère déjà le safe area (ex. iOS avec `contentInsetAdjustmentBehavior='automatic'`)
   * pour éviter un double padding.
   */
  safeAreaTop?: boolean
}

export function PinnedEventBanner({ safeAreaTop = true }: PinnedEventBannerProps = {}) {
  const media = useMedia()
  const { session } = useSession()
  const isAuthenticated = Boolean(session)
  const { data } = useSuspensePinnedEvents()
  const events = useMemo(() => {
    const allEvents = data.pages.flatMap((p) => p?.items ?? [])
    if (isAuthenticated) return allEvents
    return allEvents.filter((event) => !isEventPartial(event))
  }, [data.pages, isAuthenticated])
  const isMobile = Boolean(media.sm)
  const { paddingTop } = useLayoutSpacing({ top: true, safeAreaTop, left: false, right: false, bottom: false })

  if (events.length === 0) return null

  if (events.length === 2 && !isMobile) {
    return (
      <YStack width="100%" paddingTop={paddingTop}>
        <XStack width="100%" gap="$medium" alignItems="stretch" flexWrap="nowrap">
          {events.map((event) => (
            <PinnedEventCard key={event.uuid} event={event} sizeMode="split" isMobile={isMobile} />
          ))}
        </XStack>
      </YStack>
    )
  }

  if (events.length === 1) {
    return (
      <YStack width="100%" paddingTop={paddingTop} paddingHorizontal={isMobile ? 16 : 0} paddingBottom={isMobile ? 16 : 0}>
        <PinnedEventCard event={events[0]} sizeMode="single" isMobile={isMobile} />
      </YStack>
    )
  }

  return (
    <YStack width="100%" paddingTop={paddingTop}>
      <FadingScrollView
        showGradients={!isMobile}
        gradientColors={['#fafafb', '#fafafb00']}
        contentContainerStyle={{
          paddingRight: isMobile ? 16 : 32,
          paddingLeft: isMobile ? 16 : 0,
        }}
      >
        <XStack flexDirection="row" alignItems="stretch" gap={16} paddingBottom={isMobile ? 16 : 0}>
          {events.map((event) => (
            <PinnedEventCard key={event.uuid} event={event} sizeMode="scroll" isMobile={isMobile} />
          ))}
        </XStack>
      </FadingScrollView>
    </YStack>
  )
}
