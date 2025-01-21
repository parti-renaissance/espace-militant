import { Children, isValidElement } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { CategoryChip } from '@/features/events/components/CategoryChip'
import { EventAuthComponent } from '@/features/events/components/EventAuthComponent'
import { EventItemHandleButton } from '@/features/events/components/EventItemHandleButton'
import { EventItemHeader } from '@/features/events/components/EventItemHeader'
import { EventLocation } from '@/features/events/components/EventLocation'
import { EventPremiumChip } from '@/features/events/components/EventPremiumChip'
import { EventShareGroup } from '@/features/events/components/EventShareGroup'
import { EventToggleSubscribeButton } from '@/features/events/components/EventToggleSubscribeButton'
import { EventItemProps } from '@/features/events/types'
import { RestItemEvent } from '@/services/events/schema'
import { StatusBar } from 'expo-status-bar'
import { getTokenValue, Image, XStack, YStack, YStackProps } from 'tamagui'
import EventParticipantsSection from '../../components/EventParticipantsSection'
import { EventLive } from '../../components/EventLive'
import { getEventDetailImageFallback, isEventFull, isEventPartial } from '../../utils'
import { ScrollStack } from './EventComponents'
import { LockPublicAuthAdhCard } from './SubscribeCard'

const DateItem = (props: Partial<Pick<RestItemEvent, 'begin_at' | 'finish_at' | 'time_zone'>> & { showTime?: boolean }) => {
  if (!props.begin_at) {
    return null
  }
  return (
    <VoxCard.Date
      showTime={props.showTime}
      start={new Date(props.begin_at)}
      end={props.finish_at ? new Date(props.finish_at) : undefined}
      timeZone={props.time_zone}
    />
  )
}

const AbsoluteWrapper = (props: YStackProps) => {
  const insets = useSafeAreaInsets()
  return (
    <YStack position="absolute" bg="$white1" bottom={0} left="$0" width="100%" elevation="$1" p={16} pb={16 + insets.bottom}>
      <XStack gap={8} width="100%">
        {props.children}
      </XStack>
    </YStack>
  )
}

const BottomCTA = (props: EventItemProps) => {
  const buttonProps = { variant: 'contained', full: true, flex: 1, width: '100%', size: 'xl', shrink: false } as const
  const needAuth = isEventPartial(props.event) && !props.userUuid
  const elements = Children.map(
    [
      <EventToggleSubscribeButton {...props} buttonProps={buttonProps} />,
      <EventItemHandleButton {...props} buttonProps={{ ...buttonProps, variant: 'soft' }} />,
    ],
    //@ts-expect-error child type on string
    (child) => isValidElement(child) && child?.type(child.props),
  ).filter(Boolean)

  if (needAuth) {
    return (
      <AbsoluteWrapper>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <EventAuthComponent />
        </YStack>
      </AbsoluteWrapper>
    )
  }

  if (elements.length > 0) {
    return (
      <AbsoluteWrapper>
        {elements.map((x) => (
          <YStack key={x.key} flex={1}>
            {x}
          </YStack>
        ))}
      </AbsoluteWrapper>
    )
  }
  return null
}

const EventMobileScreen = ({ event, userUuid }: EventItemProps) => {
  const fallbackImage = getEventDetailImageFallback(event)
  const isFull = isEventFull(event)
  const insets = useSafeAreaInsets()
  return (
    <PageLayout.MainSingleColumn backgroundColor="black">
      <StatusBar animated style="light" />
      <ScrollStack marginTop={insets.top} backgroundColor="$textSurface">
        <YStack>
          <EventLive event={event} userUuid={userUuid} />
          <VoxCard overflow="hidden" pb={66}>
            {fallbackImage ? <VoxCard.Image large={true} image={fallbackImage} imageData={event.image} /> : null}
            <VoxCard.Content pt={fallbackImage ? 0 : undefined}>
              <EventItemHeader>
                <CategoryChip>{event.category?.name}</CategoryChip>
                <EventPremiumChip event={event} />
              </EventItemHeader>
              {event.name ? <VoxCard.Title underline={false}>{event.name}</VoxCard.Title> : null}
              {isFull && event.description ? <VoxCard.Description markdown>{event.description}</VoxCard.Description> : null}
              {event.name || (isFull && event.description) ? <VoxCard.Separator /> : null}
              <DateItem begin_at={event.begin_at} finish_at={event.finish_at} time_zone={event.time_zone} showTime={isFull} />
              <EventLocation event={event} />
              {isFull && !!event.capacity ? <VoxCard.Capacity>Capacité {event.capacity} personnes</VoxCard.Capacity> : null}
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
            </VoxCard.Content>
            <EventParticipantsSection event={event} userUuid={userUuid} />
          </VoxCard>
        </YStack>
      </ScrollStack>
      <BottomCTA event={event} userUuid={userUuid} />
    </PageLayout.MainSingleColumn>
  )
}

export default EventMobileScreen

export const EventMobileScreenSkeleton = () => {
  return (
    <PageLayout.MainSingleColumn>
      <SkeCard.Image />
      <SkeCard>
        <SkeCard.Content>
          <XStack justifyContent="space-between" alignItems="center">
            <SkeCard.Chip />
            <SkeCard.Chip />
          </XStack>
          <SkeCard.Title />
          <SkeCard.Description />
          <SkeCard.Separator />
          <SkeCard.Date />
          <SkeCard.Date />
          <SkeCard.Date />
          <SkeCard.Section>
            <SkeCard.Author />
          </SkeCard.Section>
          <SkeCard.Section>
            <SkeCard.Button full size="xl" />
            <SkeCard.Button full size="xl" />
            <SkeCard.Button full size="xl" />
          </SkeCard.Section>
        </SkeCard.Content>
      </SkeCard>
    </PageLayout.MainSingleColumn>
  )
}

export const EventMobileScreenDeny = () => {
  const insets = useSafeAreaInsets()
  return (
    <PageLayout.MainSingleColumn backgroundColor="#ECF1F5">
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
      </YStack>
      <YStack padding="$xlarge" pb={getTokenValue('$xlarge') + insets.bottom} bg="white" justifyContent="center" alignItems="center">
        <LockPublicAuthAdhCard />
      </YStack>
    </PageLayout.MainSingleColumn>
  )
}
