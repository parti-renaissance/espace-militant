import { memo } from 'react'
import { useMedia, View, XStack } from 'tamagui'
import { Eye, EyeOff } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useNavigateToEvent } from '@/features/events/hooks/useNavigateToEvent'
import { mapItemEventToRestEventSeed } from '@/services/common/mapper/mapItemEventToRestEventSeed'
import { RestItemEvent, type RestEvent } from '@/services/events/schema'

import { EventItemProps } from '../../types'
import { getEventItemImageFallback, isEventFull, isEventPrivate } from '../../utils'
import { EventAuthDialog } from '../detail/EventAuthComponent'
import { CategoryChip } from './CategoryChip'
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

const GoToButton = ({ event, seed, source }: { event: RestItemEvent; seed?: RestEvent | null; source?: string }) => {
  const navigateToEvent = useNavigateToEvent()

  const handlePress = () => {
    navigateToEvent(event.slug, seed ?? mapItemEventToRestEventSeed(event), { source })
  }

  return (
    <VoxButton variant="outlined" theme="blue" iconLeft={Eye} testID="event-show-button" onPress={handlePress}>
      Voir
    </VoxButton>
  )
}

export const BaseEventListItem = ({ event, userUuid, source, seed }: EventItemProps) => {
  const media = useMedia()
  const fallbackImage = getEventItemImageFallback(event)
  const isFull = isEventFull(event)
  const participantsCount = event?.participants_count

  return (
    <VoxCard>
      <VoxCard.Content>
        <XStack justifyContent="space-between" alignItems="flex-start" gap="$small">
          <XStack gap="$small" flexWrap="wrap" flexShrink={1}>
            <View gap="$small" flexWrap="wrap" flex={1} flexBasis="50%" flexDirection={media.xs ? 'column' : 'row'}>
              <CategoryChip>{event.category?.name}</CategoryChip>
              {event.hidden ? (
                <VoxCard.Chip theme="gray" icon={EyeOff}>
                  Non répertorié
                </VoxCard.Chip>
              ) : null}
            </View>
            <EventListItemLiveBadge event={event} />
          </XStack>
          <EventPremiumChip event={event} />
        </XStack>
        {event.name ? <VoxCard.Title underline={!fallbackImage}>{event.name}</VoxCard.Title> : null}
        {fallbackImage ? <VoxCard.Image image={fallbackImage} imageData={event.image} /> : null}
        <DateItem showTime={isFull} begin_at={event.begin_at} finish_at={event.finish_at} time_zone={event.time_zone} />
        <EventLocation event={event} />
        {participantsCount != null && participantsCount >= 10 && <VoxCard.Attendees attendees={{ count: participantsCount }} />}
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
          <GoToButton event={event as RestItemEvent} seed={seed} source={source} />
          <EventToggleSubscribeButton event={event} userUuid={userUuid} />
          <EventItemHandleButton event={event} userUuid={userUuid} />
        </EventItemActions>
      </VoxCard.Content>
    </VoxCard>
  )
}

const EventListItem = ({ event, userUuid, source, seed }: EventItemProps) => {
  if (!userUuid && isEventPrivate(event)) {
    return (
      <EventAuthDialog>
        <BaseEventListItem event={event} userUuid={userUuid} source={source} seed={seed} />
      </EventAuthDialog>
    )
  }
  return <BaseEventListItem event={event} userUuid={userUuid} source={source} seed={seed} />
}

export default memo(
  EventListItem,
  (prev, next) =>
    prev.event.uuid === next.event.uuid &&
    prev.userUuid === next.userUuid &&
    prev.source === next.source &&
    prev.seed === next.seed,
)
