import type { RestItemEvent, RestPartialEvent } from '@/services/events/schema'

export const mapItemEventToRestEventSeed = (event: RestItemEvent): RestPartialEvent =>
  ({
    ...event,
    object_state: 'partial',
  }) as RestPartialEvent
