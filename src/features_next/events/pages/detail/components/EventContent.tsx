import React, { Children, isValidElement } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { CategoryChip } from '@/features/events/components/CategoryChip'
import { EventAuthComponent } from '@/features_next/events/components/EventAuthComponent'
import { EventItemHandleButton } from '@/features_next/events/components/EventItemHandleButton'
import { EventLocation } from '@/features_next/events/components/EventLocation'
import { EventPremiumChip } from '@/features/events/components/EventPremiumChip'
import { EventShareGroup } from '@/features_next/events/components/EventShareGroup'
import { EventToggleSubscribeButton } from '@/features_next/events/components/EventToggleSubscribeButton'
import { EventItemProps } from '@/features_next/events/types'
import { RestItemEvent } from '@/services/events/schema'
import { XStack, YStack, useMedia } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Platform } from 'react-native'
import { EventLive } from '@/features_next/events/components/EventLive'
import EventManagementSection from '@/features_next/events/components/EventManagementSection'
import { getEventDetailImageFallback, isEventFull, isEventPartial } from '../../../utils'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import { TipTapRenderer } from '@/components/TipTapRenderer'

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

const BackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    if (Platform.OS === 'web') {
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push('/(militant)/evenements')
      }
    } else {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.dismissAll()
      }
    }
  }

  return (
    <VoxButton 
      variant="text" 
      iconLeft={ArrowLeft} 
      borderRadius={16}
      onPress={handleBack}
    >
      Retour
    </VoxButton>
  )
}

const FloatingBackButton = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.dismissAll()
    }
  }

  return (
    <YStack position="absolute" top={insets.top + 16} left={16} zIndex={100}>
      <VoxButton 
        variant="contained"
        theme="gray"
        iconLeft={ArrowLeft}
        size="md"
        shrink
        onPress={handleBack}
      />
    </YStack>
  )
}

const ActionButtons = (props: EventItemProps) => {
  const buttonProps = { variant: 'contained', full: true, flex: 1, width: '100%', size: 'xl', shrink: false } as const
  const needAuth = isEventPartial(props.event) && !props.userUuid

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

const EventInfo = ({ event }: EventItemProps) => {
  const isFull = isEventFull(event)
  const fallbackImage = getEventDetailImageFallback(event)
  const media = useMedia()

  return (
    <>
      {fallbackImage ? <VoxCard.Image large={media.sm} image={fallbackImage} imageData={event.image} /> : null}
      <YStack gap="$medium" px={media.sm ? "$medium" : 0}>
      <XStack justifyContent="space-between" alignItems="flex-start" gap={8} flexWrap="wrap"> 
        <CategoryChip>{event.category?.name}</CategoryChip>
        <EventPremiumChip event={event} />
      </XStack>
      {event.name ? <VoxCard.Title underline={false}>{event.name}</VoxCard.Title> : null}
      {isFull && event.description ? <TipTapRenderer content={event.json_description ?? ''} /> : null}
      </YStack>
    </>
  )
}

const EventMeta = ({ event, userUuid }: EventItemProps) => {
  const isFull = isEventFull(event)
  const media = useMedia()

  return (
    <YStack gap="$medium" px={media.sm ? "$medium" : 0}>
      <DateItem begin_at={event.begin_at} finish_at={event.finish_at} time_zone={event.time_zone} showTime={isFull} />
      <EventLocation event={event} />
      {isFull && !!event.capacity ? <VoxCard.Capacity>Limité à {event.capacity} inscrits</VoxCard.Capacity> : null}
      {isFull && userUuid ? <VoxCard.Attendees attendees={{ count: event.participants_count ?? 12 }} /> : null}
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
      <EventShareGroup event={event} />
    </YStack>
  )
}

// Mobile Layout
const MobileLayout = (props: EventItemProps) => {
  return (
    <>
      <LayoutScrollView padding={false}>
        <YStack paddingBottom={100}>
          <EventLive event={props.event} userUuid={props.userUuid} />
          <VoxCard overflow="hidden" pb={66} borderWidth={0}>
            <EventInfo {...props} />
            <VoxCard.Separator />
            <EventMeta {...props} />
            <EventManagementSection event={props.event} userUuid={props.userUuid} />
          </VoxCard>
        </YStack>
      </LayoutScrollView>
      <FloatingBackButton />
      <MobileBottomCTA {...props} />
    </>
  )
}

// Desktop Layout
const DesktopLayout = (props: EventItemProps) => {
  return (
    <Layout.Main maxWidth={992}>
      <LayoutScrollView>
        <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
          <BackButton />
        </XStack>
        <YStack gap="$medium">
          <EventLive event={props.event} userUuid={props.userUuid} />
          <VoxCard>
            <XStack alignItems="flex-start" py="$medium">
              <YStack flex={1} flexShrink={1} gap="$medium" px="$medium" borderRightColor="$textOutline32" borderRightWidth={1}>
                <EventInfo {...props} />
              </YStack>
              <YStack maxWidth={320} px="$medium" gap="$medium">
                <ActionButtons {...props} />
                <VoxCard.Separator />
                <EventMeta {...props} />
              </YStack>
            </XStack>
          </VoxCard>
          <EventManagementSection event={props.event} userUuid={props.userUuid} />
        </YStack>
      </LayoutScrollView>
    </Layout.Main >
  )
}

export function EventContent(props: EventItemProps) {
  const media = useMedia()
  return media.sm ? <MobileLayout {...props} /> : <DesktopLayout {...props} />
}

