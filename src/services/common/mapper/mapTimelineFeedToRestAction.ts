import { ActionStatus, type RestActionFull } from '@/services/actions/schema'
import { parseActionType } from '@/services/actions/mapper'
import { hasValidActionCoordinates } from '@/services/actions/selectors'
import type { RestTimelineFeedItem } from '@/services/timeline-feed/schema'

export const mapFeedItemToRestActionFull = (feed: RestTimelineFeedItem): RestActionFull | null => {
  if (feed.type !== 'action') {
    return null
  }

  const actionType = parseActionType(feed.category?.toLowerCase() ?? null)
  const dateValue = feed.begin_at ?? feed.date
  const address = feed.post_address

  if (!actionType || !dateValue || !address?.address || !address.postal_code || !address.city_name || !address.country) {
    return null
  }

  if (!hasValidActionCoordinates(address)) {
    return null
  }

  return {
    uuid: feed.objectID,
    type: actionType,
    date: new Date(dateValue),
    status: ActionStatus.SCHEDULED,
    post_address: {
      address: address.address,
      postal_code: address.postal_code,
      city: address.city_name ?? null,
      city_name: address.city_name,
      country: address.country,
      latitude: address.latitude!,
      longitude: address.longitude!,
    },
    user_registered_at: feed.user_registered_at ? new Date(feed.user_registered_at) : null,
    created_at: feed.date ? new Date(feed.date) : new Date(dateValue),
    updated_at: feed.date ? new Date(feed.date) : new Date(dateValue),
    author:
      feed.author?.first_name || feed.author?.last_name
        ? {
            uuid: feed.author?.uuid ?? feed.objectID,
            first_name: feed.author?.first_name ?? '',
            last_name: feed.author?.last_name ?? '',
            image_url: feed.author?.image_url ?? null,
            role: feed.author?.role ?? null,
            instance: feed.author?.instance ?? null,
            zone: feed.author?.zone ?? null,
          }
        : null,
    description: feed.description ?? null,
    editable: feed.editable ?? false,
    participants: [],
  }
}
