import type { HubItemMapItem } from '@/features_next/events/pages/map/components/HubItemMap'
import type { ActionVoxCardProps } from '@/components/Cards/ActionCard'

import { isEventPast } from '@/features_next/events/utils'
import { ActionStatus, ActionType } from '@/services/actions/schema'
import type { RestItemEvent, RestPartialEvent } from '@/services/events/schema'

import { isHubActionItem, isHubEventItem, type RestHubItem } from './schema'

const parseActionType = (slug: string | undefined | null): ActionType | null => {
  if (!slug) {
    return null
  }
  return (Object.values(ActionType) as string[]).includes(slug) ? (slug as ActionType) : null
}

const mapHubEventStatus = (status: RestHubItem['status']): RestItemEvent['status'] => {
  if (status === 'SCHEDULED' || status === 'CANCELLED') {
    return status
  }
  return 'SCHEDULED'
}

export const mapHubItemToRestItemEvent = (item: RestHubItem): RestItemEvent | null => {
  if (!isHubEventItem(item) || !item.slug) {
    return null
  }

  const objectState = item.object_state ?? 'partial'

  const base = {
    uuid: item.uuid,
    name: item.name,
    slug: item.slug,
    status: mapHubEventStatus(item.status),
    visibility: item.visibility ?? 'public',
    begin_at: item.begin_at,
    finish_at: item.finish_at,
    time_zone: item.time_zone ?? 'Europe/Paris',
    post_address: item.post_address,
    organizer: item.organizer
      ? {
          uuid: item.organizer.uuid,
          first_name: item.organizer.first_name,
          last_name: item.organizer.last_name,
          role: item.organizer.role ?? null,
          instance: item.organizer.instance ?? null,
          zone: item.organizer.zone ?? null,
          image_url: item.organizer.image_url ?? null,
          scope: item.organizer.scope ?? null,
        }
      : null,
    image: item.image,
    mode: item.mode,
    category: item.category
      ? {
          name: item.category.name,
          slug: item.category.slug,
          description: item.category.description,
          event_group_category: item.category.event_group_category ?? {
            name: '',
            slug: '',
            description: null,
          },
        }
      : null,
    participants_count: item.participants_count,
    visio_url: item.visio_url,
    hidden: item.hidden,
    user_registered_at: item.user_registered_at,
    is_national: item.is_national,
    editable: item.editable,
    edit_link: item.edit_link,
  }

  if (objectState === 'full') {
    return { object_state: 'full', ...base } as RestItemEvent
  }

  return { object_state: 'partial', ...base } as RestPartialEvent
}

export const mapHubItemToActionCardPayload = (item: RestHubItem): ActionVoxCardProps['payload'] | null => {
  if (!isHubActionItem(item)) {
    return null
  }

  const actionType = parseActionType(item.category?.slug)
  if (!actionType) {
    return null
  }

  const status =
    item.status === ActionStatus.CANCELLED || item.status === 'CANCELLED' ? ActionStatus.CANCELLED : ActionStatus.SCHEDULED

  const address = item.post_address

  return {
    id: item.uuid,
    tag: item.category?.name ?? item.name,
    status,
    isSubscribed: Boolean(item.user_registered_at),
    date: {
      start: new Date(item.begin_at),
      end: new Date(item.begin_at),
    },
    location: {
      city: address?.city_name ?? address?.city ?? '',
      street: address?.address ?? '',
      postalCode: address?.postal_code ?? '',
    },
    author: item.organizer
      ? {
          name: `${item.organizer.first_name} ${item.organizer.last_name}`,
          role: item.organizer.role ?? null,
          title: item.organizer.instance ?? null,
          pictureLink: item.organizer.image_url ?? undefined,
          zone: item.organizer.zone ?? null,
        }
      : undefined,
    attendees:
      item.participants_count != null
        ? {
            count: item.participants_count,
            pictures: [],
          }
        : undefined,
  }
}

export type HubFeedRow =
  | { type: 'event'; event: RestItemEvent }
  | { type: 'action'; payload: ActionVoxCardProps['payload']; editable: boolean }

export const mapHubItemToFeedRow = (item: RestHubItem): HubFeedRow | null => {
  const event = mapHubItemToRestItemEvent(item)
  if (event) {
    return { type: 'event', event }
  }

  const payload = mapHubItemToActionCardPayload(item)
  if (payload) {
    return { type: 'action', payload, editable: item.editable }
  }

  return null
}

const isFiniteCoordinate = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

export const mapHubItemToMapMarker = (item: RestHubItem): HubItemMapItem | null => {
  if (!isFiniteCoordinate(item.post_address?.latitude) || !isFiniteCoordinate(item.post_address?.longitude)) {
    return null
  }

  const latitude = item.post_address!.latitude!
  const longitude = item.post_address!.longitude!
  const isPast = isEventPast({ begin_at: item.begin_at, finish_at: item.finish_at })

  if (isHubEventItem(item)) {
    if (typeof item.slug !== 'string' || item.slug.length === 0) {
      return null
    }

    return {
      uuid: item.uuid,
      name: item.name,
      slug: item.slug,
      itemType: 'event',
      latitude,
      longitude,
      visibility: item.visibility ?? 'public',
      isPast,
    }
  }

  if (isHubActionItem(item)) {
    const actionType = parseActionType(item.category?.slug)
    if (!actionType) {
      return null
    }

    return {
      uuid: item.uuid,
      name: item.name,
      slug: null,
      itemType: 'action',
      actionType,
      latitude,
      longitude,
      visibility: 'public',
      isPast,
      isCancelled: item.status === ActionStatus.CANCELLED || item.status === 'CANCELLED',
    }
  }

  return null
}

export const mapHubItemsToMapMarkers = (items: RestHubItem[]): HubItemMapItem[] =>
  items.map(mapHubItemToMapMarker).filter((marker): marker is HubItemMapItem => marker !== null)

export const mapHubItemsToPinnedEvents = (items: RestHubItem[]): RestItemEvent[] =>
  items
    .filter((item) => item.pinned && isHubEventItem(item))
    .map(mapHubItemToRestItemEvent)
    .filter((event): event is RestItemEvent => event !== null)
