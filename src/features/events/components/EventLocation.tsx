import VoxCard from '@/components/VoxCard/VoxCard'
import { RestItemEvent } from '@/services/events/schema'
import { YStack } from 'tamagui'

export const EventLocation = ({ event }: { event: Partial<RestItemEvent> }) => {
  if (event.mode === 'online') {
    return (
      <YStack testID="event-location-visio">
        <VoxCard.Visio url={event?.visio_url} asLink={!!event?.user_registered_at} />
      </YStack>
    )
  }

  if (event.post_address) {
    return (
      <YStack testID="event-location-location">
        <VoxCard.Location
          location={{
            city: event.post_address.city_name,
            postalCode: event.post_address.postal_code,
            street: event.post_address.address,
          }}
        />
      </YStack>
    )
  }

  return null
}
