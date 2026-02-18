import { isAfter, isBefore, subHours } from 'date-fns'

import { RestFullEvent, RestItemEvent, RestPartialEvent, RestPublicItemEvent } from '@/services/events/schema'

export type EventSectionId = 'national' | 'zone' | 'region' | 'past'

export type EventSection<T extends RestItemEvent | RestPublicItemEvent = RestItemEvent> = {
  id: string
  title: string
  data: T[]
}

type GroupEventsBySectionOptions = {
  zoneLabel?: string
}

export const groupEventsBySection = <T extends RestItemEvent | RestPublicItemEvent>(events: T[], options?: GroupEventsBySectionOptions): EventSection<T>[] => {
  const zoneLabel = options?.zoneLabel
  const national: T[] = []
  const zone: T[] = []
  const regionByCode = new Map<string, { region: { code: string; name: string }; events: T[] }>()
  const past: T[] = []

  for (const event of events) {
    const isPast = isEventPast(event)
    if (isPast) {
      past.push(event)
      continue
    }

    const isNational = isEventFull(event) && event.is_national === true
    if (isNational) {
      national.push(event)
      continue
    }

    const hasRegion = event.region != null && event.region !== undefined
    if (hasRegion && event.region) {
      const existing = regionByCode.get(event.region.code)
      if (existing) {
        existing.events.push(event)
      } else {
        regionByCode.set(event.region.code, { region: event.region, events: [event] })
      }
    } else {
      zone.push(event)
    }
  }

  const sections: EventSection<T>[] = []

  if (national.length > 0) {
    sections.push({ id: 'national', title: 'Événements nationaux', data: national })
  }
  if (zone.length > 0 || zoneLabel) {
    const zoneTitle = zoneLabel === 'Toutes' ? 'À venir' : zoneLabel ? `${zoneLabel.replace(' • ', ' - ')}` : 'À venir'
    sections.push({ id: 'zone', title: zoneTitle, data: zone })
  }
  const regionEntries = [...regionByCode.entries()].sort(([a], [b]) => a.localeCompare(b))
  for (const [code, { region, events: regionEvents }] of regionEntries) {
    sections.push({
      id: `region-${code}`,
      title: `Région ${region.name}`,
      data: regionEvents,
    })
  }
  if (past.length > 0) {
    sections.push({ id: 'past', title: 'Événements passés', data: past })
  }

  return sections
}

export const isEventPast = (event: Partial<RestItemEvent>) => {
  const date = event.finish_at || event.begin_at
  return date ? isBefore(new Date(date), new Date()) : false
}

export const isEventStarted = (event: Partial<RestItemEvent>) => {
  const startDate = event.begin_at ? new Date(event.begin_at) : undefined
  if (!startDate) {
    return false
  }
  return isAfter(new Date(), startDate)
}

export const isEventStartInLessThanOneHour = (event: Partial<RestItemEvent>) => {
  const startDate = event.begin_at ? new Date(event.begin_at) : undefined
  if (!startDate) {
    return false
  }

  return isAfter(new Date(), subHours(startDate, 1))
}

export const isEventCancelled = (
  event: Partial<RestItemEvent>,
): event is Partial<RestItemEvent> & {
  status: 'CANCELLED'
} => {
  return event.status === 'CANCELLED'
}

export const isEventFull = (
  event: Partial<RestItemEvent>,
): event is Partial<RestFullEvent> & {
  object_state: 'full'
} => {
  return event.object_state === 'full'
}

export const isEventCapacityReached = (event: Partial<RestItemEvent>) => {
  if (isEventFull(event) && event.participants_count != null) {
    return event.capacity && event.participants_count >= event.capacity
  }
  return false
}

export const isEventPartial = (
  event: Partial<RestItemEvent>,
): event is Partial<RestPartialEvent> & {
  object_state: 'partial'
} => {
  return event.object_state === 'partial'
}

export const isEventAdherentReserved = (event: Partial<RestItemEvent>) => {
  return event.visibility === 'adherent'
}

export const isEventAdherentDuesReserved = (event: Partial<RestItemEvent>) => {
  return event.visibility === 'adherent_dues'
}

export const isEventPrivate = (event: Partial<RestItemEvent>) => {
  return event.visibility === 'private'
}

export const isEventInvitationAgora = (event: Partial<RestItemEvent>) => {
  return event.visibility === 'invitation_agora'
}

export const isAdherentLock = (event: Partial<RestItemEvent>) => isEventPartial(event) && isEventAdherentReserved(event)
export const isAdherentDuesLock = (event: Partial<RestItemEvent>) => isEventPartial(event) && isEventAdherentDuesReserved(event)

export const isEventEditable = (
  event: Partial<RestItemEvent>,
): event is Partial<RestFullEvent> & {
  object_state: 'full'
  editable: true
  edit_link: string
} => {
  return Boolean(isEventFull(event) && event.editable && event.edit_link && !isEventCancelled(event))
}

export const isEventRegister = (
  event: Partial<RestItemEvent>,
): event is Partial<RestFullEvent> & {
  object_state: 'full'
  user_registered_at: string
} => {
  return Boolean(isEventFull(event) && event.user_registered_at)
}

export const isEventToggleRegisterDisabled = (event: Partial<RestItemEvent>) =>
  [isEventCancelled(event), isEventPast(event), isEventCapacityReached(event) && !isEventRegister(event)].some(Boolean)

export const isEventUserAuthor = (event: Partial<RestItemEvent>, userUuid?: string) =>
  typeof userUuid === 'string' && typeof event.organizer?.uuid === 'string' && userUuid === event.organizer.uuid

export const isEventToggleRegisterHided = (event: Partial<RestItemEvent>, userUuid?: string) => [isEventUserAuthor(event, userUuid)].some(Boolean)

export const getEventItemImageFallback = (event: Partial<RestItemEvent>) => {
  if (isEventPartial(event)) {
    return require('@/features_next/events/assets/images/event-fallback-private-lock.png')
  }
  return event.image?.url
}

export const getEventDetailImageFallback = (event: Partial<RestItemEvent>) => {
  if (isEventPartial(event)) {
    return require('@/features_next/events/assets/images/event-fallback-private-lock.png')
  }
  return event.image?.url ?? require('@/features_next/events/assets/images/event-fallback.png')
}

export const isEventHasNationalLive = (
  event: Partial<RestItemEvent>,
): event is Partial<RestFullEvent> & {
  object_state: 'full'
  live_url: string
} => {
  if (!isEventFull(event)) {
    return false
  }

  if (!event.is_national) {
    return false
  }

  return !!event.live_url && (event.live_url.startsWith('https://vimeo.com/') || event.live_url.startsWith('https://player.vimeo.com/'))
}
