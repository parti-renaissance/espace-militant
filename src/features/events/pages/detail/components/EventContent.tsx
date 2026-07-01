import React, { Children, isValidElement } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMedia, XStack, YStack } from 'tamagui'
import { EyeOff } from '@tamagui/lucide-icons'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { ContentBackButton } from '@/components/ContentBackButton'
import { FloatingBackButton } from '@/components/FloatingBackButton'
import { TipTapRenderer } from '@/components/TipTapRenderer'
import VoxCard from '@/components/VoxCard/VoxCard'
import { CategoryChip } from '@/features/events/components/list-item/CategoryChip'
import { EventAuthComponent } from '@/features/events/components/detail/EventAuthComponent'
import { EventItemHandleButton } from '@/features/events/components/list-item/EventItemHandleButton'
import { EventLive } from '@/features/events/components/list-item/EventLive'
import { EventLocation } from '@/features/events/components/list-item/EventLocation'
import { EventPremiumChip } from '@/features/events/components/list-item/EventPremiumChip'
import EventManagementSection from './EventManagementSection'
import { DetailShareGroup } from '@/components/ShareGroup/DetailShareGroup'
import { EventToggleSubscribeButton } from '@/features/events/components/list-item/EventToggleSubscribeButton'
import { EventItemProps } from '@/features/events/types'

import { RestItemEvent } from '@/services/events/schema'

import { getEventDetailImageFallback, isEventDetailsLoading, isEventFull, isEventPartial, isEventPast } from '../../../utils'
import { EventAttendeesSkeleton, EventCapacitySkeleton, EventDescriptionSkeleton } from './EventSkeleton'

const DateItem = (props: Partial<Pick<RestItemEvent, 'begin_at' | 'finish_at' | 'time_zone'>> & { showTime?: boolean }) => {
  if (!props.begin_at) return null

  return (
    <VoxCard.Date
      showTime={props.showTime}
      start={new Date(props.begin_at)}
      end={props.finish_at ? new Date(props.finish_at) : undefined}
      timeZone={props.time_zone}
    />
  )
}

const ActionButtons = (props: EventItemProps) => {
  const buttonProps = { variant: 'contained', full: true, flex: 1, width: '100%', size: 'xl', shrink: false } as const
  const needAuth = isEventPartial(props.event) && !props.userUuid && !isEventPast(props.event)

  const elements = Children.map(
    [
      <EventToggleSubscribeButton {...props} buttonProps={buttonProps} />,
      <EventItemHandleButton {...props} buttonProps={{ ...buttonProps, variant: 'soft' }} />,
    ],
    //@ts-expect-error child type on string
    (child) => isValidElement(child) && child?.type?.(child.props),
  ).filter(Boolean)

  if (needAuth) {
    return (
      <XStack gap={8} width="100%">
        <EventAuthComponent />
      </XStack>
    )
  }

  if (elements.length > 0) {
    return (
      <XStack gap={8} width="100%">
        {elements.map((x) => (
          <YStack key={x.key} flex={1}>
            {x}
          </YStack>
        ))}
      </XStack>
    )
  }

  return null
}

const MobileBottomCTA = (props: EventItemProps) => {
  const insets = useSafeAreaInsets()
  const content = <ActionButtons {...props} />

  if (!content) return null

  return (
    <YStack position="absolute" bg="$white1" bottom={0} left="$0" width="100%" elevation="$1" p={16} pb={insets.bottom}>
      {content}
    </YStack>
  )
}

const EventInfo = ({ event, isDescriptionLoading }: EventItemProps & { isDescriptionLoading?: boolean }) => {
  const isFull = isEventFull(event)
  const fullEvent = isFull ? event : null
  const fallbackImage = getEventDetailImageFallback(event)
  const media = useMedia()

  return (
    <>
      {fallbackImage ? <VoxCard.Image large={media.sm} image={fallbackImage} imageData={event.image} /> : null}
      <YStack gap="$medium" px={media.sm ? '$medium' : 0}>
        <XStack justifyContent="space-between" alignItems="flex-start" gap="$small" flexWrap="wrap">
          <CategoryChip>{event.category?.name}</CategoryChip>
          <EventPremiumChip event={event} />
        </XStack>
        {event.hidden ? (
          <VoxCard backgroundColor="$textSurface" inside>
            <VoxCard.Content>
              <XStack gap="$medium" alignItems="center">
                <YStack w={16}>
                  <EyeOff size={16} color="$textPrimary" />
                </YStack>
                <YStack flexShrink={1}>
                  <Text.SM color="$textPrimary">
                    <Text.SM bold color="$textPrimary">
                      Non répertorié.{' '}
                    </Text.SM>
                    Cet événement n'est accessible que par son lien direct et ne peut pas être retrouvé via la plateforme.
                  </Text.SM>
                </YStack>
              </XStack>
            </VoxCard.Content>
          </VoxCard>
        ) : null}
        {event.name ? <VoxCard.Title underline={false}>{event.name}</VoxCard.Title> : null}
        {isDescriptionLoading ? (
          <EventDescriptionSkeleton />
        ) : fullEvent?.description ? (
          <TipTapRenderer content={fullEvent.json_description ?? ''} />
        ) : null}
      </YStack>
    </>
  )
}

const EventMeta = ({
  event,
  userUuid,
  isCapacityLoading,
  isAttendeesLoading,
  isDetailsLoading,
}: EventItemProps & { isCapacityLoading?: boolean; isAttendeesLoading?: boolean; isDetailsLoading?: boolean }) => {
  const isFull = isEventFull(event)
  const fullEvent = isFull ? event : null
  const media = useMedia()

  return (
    <YStack gap="$medium" px={media.sm ? '$medium' : 0}>
      <DateItem begin_at={event.begin_at} finish_at={event.finish_at} time_zone={event.time_zone} showTime={isFull} />
      <EventLocation event={event} />
      {isCapacityLoading ? (
        <EventCapacitySkeleton />
      ) : fullEvent?.capacity != null ? (
        <VoxCard.Capacity>Limité à {fullEvent.capacity} inscrits</VoxCard.Capacity>
      ) : null}
      {isAttendeesLoading ? (
        <EventAttendeesSkeleton />
      ) : isFull && userUuid ? (
        <VoxCard.Attendees attendees={{ count: event.participants_count ?? 12 }} />
      ) : null}
      {event.organizer ? (
        <VoxCard.Section title="Événement créé par :">
          <VoxCard.Author
            author={{
              role: event.organizer?.role,
              name: [event.organizer?.first_name, event.organizer?.last_name].filter(Boolean).join(' '),
              zone: event.organizer?.zone,
              title: event.organizer?.instance,
              pictureLink: event.organizer?.image_url ?? undefined,
            }}
          />
        </VoxCard.Section>
      ) : null}
      <DetailShareGroup event={event} isDetailsLoading={isDetailsLoading} />
    </YStack>
  )
}

// Mobile Layout
const MobileLayout = (props: EventItemProps) => {
  const isDetailsLoading = isEventDetailsLoading(props.event, props.isFetching)
  const isDescriptionLoading = isDetailsLoading
  const isCapacityLoading = isDetailsLoading && !isEventFull(props.event)
  const isAttendeesLoading = isDetailsLoading && props.event.participants_count == null

  return (
    <>
      <Layout.Main maxWidth={892}>
        <LayoutScrollView padding={false}>
          <YStack paddingBottom={100}>
            <EventLive event={props.event} userUuid={props.userUuid} />
            <VoxCard overflow="hidden" pb={66} borderWidth={0}>
              <EventInfo {...props} isDescriptionLoading={isDescriptionLoading} />
              <VoxCard.Separator />
              <EventMeta {...props} isCapacityLoading={isCapacityLoading} isAttendeesLoading={isAttendeesLoading} isDetailsLoading={isDetailsLoading} />
              <EventManagementSection event={props.event} userUuid={props.userUuid} />
            </VoxCard>
          </YStack>
        </LayoutScrollView>
      </Layout.Main>
      <FloatingBackButton withSafeArea={Boolean(props.userUuid)} />
      <MobileBottomCTA {...props} />
    </>
  )
}

// Desktop Layout
const DesktopLayout = (props: EventItemProps) => {
  const isDetailsLoading = isEventDetailsLoading(props.event, props.isFetching)
  const isDescriptionLoading = isDetailsLoading
  const isCapacityLoading = isDetailsLoading && !isEventFull(props.event)
  const isAttendeesLoading = isDetailsLoading && props.event.participants_count == null

  return (
    <Layout.Main maxWidth={892}>
      <LayoutScrollView>
        <ContentBackButton fallbackPath="/" />
        <YStack gap="$medium">
          <EventLive event={props.event} userUuid={props.userUuid} />
          <VoxCard>
            <XStack alignItems="flex-start" py="$medium">
              <YStack flex={1} flexShrink={1} gap="$medium" px="$medium" borderRightColor="$textOutline32" borderRightWidth={1}>
                <EventInfo {...props} isDescriptionLoading={isDescriptionLoading} />
              </YStack>
              <YStack maxWidth={320} px="$medium" gap="$medium">
                <ActionButtons {...props} />
                <VoxCard.Separator />
                <EventMeta {...props} isCapacityLoading={isCapacityLoading} isAttendeesLoading={isAttendeesLoading} isDetailsLoading={isDetailsLoading} />
              </YStack>
            </XStack>
          </VoxCard>
          <EventManagementSection event={props.event} userUuid={props.userUuid} />
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

export function EventContent({ isFetching = false, ...props }: EventItemProps) {
  const media = useMedia()
  return media.sm ? <MobileLayout {...props} isFetching={isFetching} /> : <DesktopLayout {...props} isFetching={isFetching} />
}
