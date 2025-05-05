import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestItemEvent } from '@/services/events/schema'
import { Eye } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { isWeb, XStack } from 'tamagui'
import { EventItemProps } from '../types'
import { getEventItemImageFallback, isEventFull, isEventPrivate } from '../utils'
import { CategoryChip } from './CategoryChip'
import { EventAuthDialog } from './EventAuthComponent'
import { EventItemActions } from './EventItemActions'
import { EventItemHandleButton } from './EventItemHandleButton'
import { EventItemHeader } from './EventItemHeader'
import { EventListItemLiveBadge } from './EventListItemLiveBadge'
import { EventLocation } from './EventLocation'
import { EventPremiumChip } from './EventPremiumChip'
import { EventToggleSubscribeButton } from './EventToggleSubscribeButton'

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

const GoToButton = ({ eventUuid }: { eventUuid: string }) => {
  return (
    <Link href={`/evenements/${eventUuid}`} asChild={!isWeb}>
      <VoxButton variant="outlined" theme="gray" iconLeft={Eye} testID="event-show-button">
        Voir
      </VoxButton>
    </Link>
  )
}

export const BaseEventListItem = ({ event, userUuid }: EventItemProps) => {
  const fallbackImage = getEventItemImageFallback(event)
  const isFull = isEventFull(event)
  const participantsCount = event?.participants_count

  console.log({participantsCount, if: participantsCount != null && participantsCount >= 10});
  
  
  return (
    <VoxCard>
      <VoxCard.Content>
        <EventItemHeader>
          <XStack gap="$small" flexWrap="wrap" flexShrink={1}>
            <CategoryChip>{event.category?.name}</CategoryChip>
            <EventListItemLiveBadge event={event} />
          </XStack>
          <EventPremiumChip event={event} />
        </EventItemHeader>
        {event.name ? <VoxCard.Title underline={!fallbackImage}>{event.name}</VoxCard.Title> : null}
        {fallbackImage ? <VoxCard.Image image={fallbackImage} imageData={event.image} /> : null}
        <DateItem showTime={isFull} begin_at={event.begin_at} finish_at={event.finish_at} time_zone={event.time_zone} />
        <EventLocation event={event} />
        {participantsCount != null && participantsCount >= 10 && (
          <VoxCard.Attendees attendees={{ count: participantsCount }} />
        )}
        <VoxCard.Author
          author={{
            role: event.organizer?.role,
            name: [event.organizer?.first_name, event.organizer?.last_name].filter(Boolean).join(' '),
            zone: event.organizer?.zone,
            title: event.organizer?.instance,
            pictureLink: event.organizer?.image_url ?? undefined,
          }}
        />
        <EventItemActions>
          <GoToButton eventUuid={event.slug} />
          <EventToggleSubscribeButton event={event} userUuid={userUuid} />
          <EventItemHandleButton event={event} userUuid={userUuid} />
        </EventItemActions>
      </VoxCard.Content>
    </VoxCard>
  )
}

const EventListItem = ({ event, userUuid }: EventItemProps) => {
  if (!userUuid && isEventPrivate(event)) {
    return (
      <EventAuthDialog>
        <BaseEventListItem event={event} />
      </EventAuthDialog>
    )
  }
  return <BaseEventListItem event={event} userUuid={userUuid} />
}

export default EventListItem
