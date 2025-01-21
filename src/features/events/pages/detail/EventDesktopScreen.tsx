import { Children, isValidElement } from 'react'
import { VoxButton } from '@/components/Button'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { CategoryChip } from '@/features/events/components/CategoryChip'
import { EventAuthComponent } from '@/features/events/components/EventAuthComponent'
import { EventItemHandleButton } from '@/features/events/components/EventItemHandleButton'
import { EventItemHeader } from '@/features/events/components/EventItemHeader'
import { EventLive } from '@/features/events/components/EventLive'
import { EventLocation } from '@/features/events/components/EventLocation'
import { EventPremiumChip } from '@/features/events/components/EventPremiumChip'
import { EventShareGroup } from '@/features/events/components/EventShareGroup'
import { EventItemProps } from '@/features/events/types'
import { RestItemEvent } from '@/services/events/schema'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Link, useNavigation } from 'expo-router'
import { Image, isWeb, XStack, YStack } from 'tamagui'
import EventParticipantsSection from '../../components/EventParticipantsSection'
import { EventToggleSubscribeButton } from '../../components/EventToggleSubscribeButton'
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

const HeaderCTA = (props: EventItemProps) => {
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

const EventDesktopAside = ({ event, userUuid }: EventItemProps) => {
  const isFull = isEventFull(event)
  return (
    <PageLayout.SideBarRight alwaysShow paddingTop={0}>
      <VoxCard.Content>
        <HeaderCTA event={event} userUuid={userUuid} />
        <VoxCard.Separator />
        <DateItem showTime={isFull} begin_at={event.begin_at} finish_at={event.finish_at} time_zone={event.time_zone} />
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
    </PageLayout.SideBarRight>
  )
}

const EventDesktopMain = ({ event }: EventItemProps) => {
  const fallbackImage = getEventDetailImageFallback(event)
  const isFull = isEventFull(event)
  return (
    <PageLayout.MainSingleColumn height="100%">
      <VoxCard.Content pr={0} height="100%">
        <VoxCard.Content height="100%" p={0} pr="$medium" borderRightColor="$textOutline32" borderRightWidth={1}>
          {fallbackImage ? <VoxCard.Image image={fallbackImage} imageData={event.image} /> : null}
          <EventItemHeader>
            <CategoryChip>{event.category?.name}</CategoryChip>
            <EventPremiumChip event={event} />
          </EventItemHeader>
          {event.name ? <VoxCard.Title underline={false}>{event.name}</VoxCard.Title> : null}
          {isFull && event.description ? <VoxCard.Description markdown>{event.description}</VoxCard.Description> : null}
        </VoxCard.Content>
      </VoxCard.Content>
    </PageLayout.MainSingleColumn>
  )
}

const BackButton = (props: { children?: React.ReactNode }) => {
  const { canGoBack } = useNavigation()
  return (
    <Link href={canGoBack() ? '../' : '/evenements'} asChild={!isWeb}>
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16}>
        {props.children ?? 'Retour'}
      </VoxButton>
    </Link>
  )
}

const EventDesktopScreen = ({ event, userUuid }: EventItemProps) => {
  return (
    <ScrollStack>
      <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
        <BackButton />
      </XStack>
      <YStack gap="$medium">
        <EventLive event={event} userUuid={userUuid} />
        <VoxCard>
          <XStack>
            <EventDesktopMain event={event} userUuid={userUuid} />
            <EventDesktopAside event={event} userUuid={userUuid} />
          </XStack>
        </VoxCard>
          <EventParticipantsSection event={event} userUuid={userUuid} />
      </YStack>
    </ScrollStack>
  )
}

export default EventDesktopScreen

const EventDesktopMainSkeleton = () => {
  return (
    <PageLayout.MainSingleColumn>
      <SkeCard.Content>
        <SkeCard.Image />
        <XStack justifyContent="space-between" alignItems="center">
          <SkeCard.Chip />
          <SkeCard.Chip />
        </XStack>
        <SkeCard.Title />
        <SkeCard.Description />
      </SkeCard.Content>
    </PageLayout.MainSingleColumn>
  )
}

const EventDesktopAsideSkeleton = () => {
  return (
    <PageLayout.SideBarRight alwaysShow paddingTop={0}>
      <SkeCard.Content>
        <SkeCard.Button full size="xl" />
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
    </PageLayout.SideBarRight>
  )
}

export const EventDesktopScreenSkeleton = () => {
  return (
    <YStack padding="$medium" flex={1}>
      <PageLayout.MainSingleColumn>
        <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
          <SkeCard.Button />
        </XStack>
        <SkeCard>
          <XStack>
            <EventDesktopMainSkeleton />
            <EventDesktopAsideSkeleton />
          </XStack>
        </SkeCard>
      </PageLayout.MainSingleColumn>
    </YStack>
  )
}

const EventDesktopAsideDeny = () => {
  return (
    <PageLayout.SideBarRight alwaysShow paddingTop={0}>
      <VoxCard.Content height="100%">
        <YStack flex={1} justifyContent="center" alignItems="center" height="100%">
          <LockPublicAuthAdhCard />
        </YStack>
      </VoxCard.Content>
    </PageLayout.SideBarRight>
  )
}

const EventDesktopMainDeny = () => {
  return (
    <PageLayout.MainSingleColumn height={500} backgroundColor="#ECF1F5">
      <VoxCard.Content pr={0} height="100%" justifyContent="center" alignItems="center">
        <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
      </VoxCard.Content>
    </PageLayout.MainSingleColumn>
  )
}

export const EventDesktopScreenDeny = () => {
  return (
    <ScrollStack>
      <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
        <BackButton>Événements</BackButton>
      </XStack>
      <VoxCard overflow="hidden">
        <XStack>
          <EventDesktopMainDeny />
          <EventDesktopAsideDeny />
        </XStack>
      </VoxCard>
    </ScrollStack>
  )
}
