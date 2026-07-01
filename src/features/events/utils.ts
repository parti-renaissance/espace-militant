import eventFallbackPrivateLock from '@/features/events/assets/images/event-fallback-private-lock.png'
import eventFallback from '@/features/events/assets/images/event-fallback.png'

import { RestItemEvent } from '@/services/events/schema'
import { shouldUseLockImageFallback } from '@/services/events/selectors'

export type { EventSection, EventSectionId } from '@/services/events/selectors'

export {
  groupEventsBySection,
  isAdherentDuesLock,
  isAdherentLock,
  isEventAdherentDuesReserved,
  isEventAdherentReserved,
  isEventCancelled,
  isEventCapacityReached,
  isEventDetailsLoading,
  isEventEditable,
  isEventEditorKnown,
  isEventFull,
  isEventHasNationalLive,
  isEventInvitation,
  isEventPartial,
  isEventPast,
  isEventPrivate,
  isEventRegister,
  isEventStartInLessThanOneHour,
  isEventStarted,
  isEventToggleRegisterDisabled,
  isEventToggleRegisterHided,
  isEventUserAuthor,
} from '@/services/events/selectors'

export const getEventItemImageFallback = (event: Partial<RestItemEvent>) => {
  if (event.image?.url) {
    return event.image.url
  }
  if (shouldUseLockImageFallback(event)) {
    return eventFallbackPrivateLock
  }
  return undefined
}

export const getEventDetailImageFallback = (event: Partial<RestItemEvent>) => {
  return event.image?.url ?? eventFallback
}
