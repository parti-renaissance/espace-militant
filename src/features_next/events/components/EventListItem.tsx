import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestItemEvent } from '@/services/events/schema'
import { Eye } from '@tamagui/lucide-icons'
import { useRouter, Href } from 'expo-router'
import { XStack } from 'tamagui'
import { EventItemProps } from '../types'
import { getEventItemImageFallback, isEventFull, isEventPrivate } from '../utils'
import { CategoryChip } from './CategoryChip'
import { EventAuthDialog } from './EventAuthComponent'
import { EventItemActions } from './EventItemActions'
import { EventItemHandleButton } from './EventItemHandleButton'
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

const GoToButton = ({ eventUuid, source }: { eventUuid: string, source?: string }) => {
  const router = useRouter()
  const href = `/(militant)/evenements/${eventUuid}?source=${source || ''}` as Href
  
  // Sur mobile, utiliser router.push
  const handlePress = () => {
    router.push(href)
  }

  return (
    <VoxButton 
      variant="outlined" 
      theme="gray" 
      iconLeft={Eye} 
      testID="event-show-button"
      onPress={handlePress}
    >
      Voir
    </VoxButton>
  )
}


export const BaseEventListItem = ({ event, userUuid, source }: EventItemProps) => {
  const fallbackImage = getEventItemImageFallback(event)
  const isFull = isEventFull(event)
  const participantsCount = event?.participants_count

  return (
    <VoxCard>
      <VoxCard.Content>
        <XStack justifyContent="space-between" alignItems="flex-start" gap={8}>
          <XStack gap="$small" flexWrap="wrap" flexShrink={1}>
            <CategoryChip>{event.category?.name}</CategoryChip>
            <EventListItemLiveBadge event={event} />
          </XStack>
          <EventPremiumChip event={event} />
        </XStack>
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
          <GoToButton eventUuid={event.slug} source={source} />
          <EventToggleSubscribeButton event={event} userUuid={userUuid} />
          <EventItemHandleButton event={event} userUuid={userUuid} />
        </EventItemActions>
      </VoxCard.Content>
    </VoxCard>
  )
}

const EventListItem = ({ event, userUuid, source }: EventItemProps) => {
  if (!userUuid && isEventPrivate(event)) {
    return (
      <EventAuthDialog>
        <BaseEventListItem event={event} source={source} />
      </EventAuthDialog>
    )
  }
  return <BaseEventListItem event={event} userUuid={userUuid} source={source} />
}

export default EventListItem
