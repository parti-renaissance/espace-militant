import { ActionStatus, ActionType, type RestActionFull } from '@/services/actions/schema'
import { hasValidActionCoordinates } from '@/services/actions/selectors'
import { isHubActionItem, type RestHubItem } from '@/services/hub/schema'

export const parseActionType = (slug: string | undefined | null): ActionType | null => {
  if (!slug) {
    return null
  }
  return (Object.values(ActionType) as string[]).includes(slug) ? (slug as ActionType) : null
}

const mapHubActionStatus = (status: RestHubItem['status']): ActionStatus =>
  status === ActionStatus.CANCELLED || status === 'CANCELLED' ? ActionStatus.CANCELLED : ActionStatus.SCHEDULED

export const mapHubItemToRestActionFull = (item: RestHubItem): RestActionFull | null => {
  if (!isHubActionItem(item)) {
    return null
  }

  const actionType = parseActionType(item.category?.slug)
  const address = item.post_address
  if (!actionType || !address?.address || !address.postal_code || !address.city_name || !address.country) {
    return null
  }

  if (!hasValidActionCoordinates(address)) {
    return null
  }

  return {
    uuid: item.uuid,
    type: actionType,
    date: new Date(item.begin_at),
    status: mapHubActionStatus(item.status),
    post_address: {
      address: address.address,
      postal_code: address.postal_code,
      city: address.city ?? null,
      city_name: address.city_name,
      country: address.country,
      latitude: address.latitude,
      longitude: address.longitude,
    },
    user_registered_at: item.user_registered_at ? new Date(item.user_registered_at) : null,
    created_at: item.created_at ? new Date(item.created_at) : new Date(item.begin_at),
    updated_at: item.updated_at ? new Date(item.updated_at) : new Date(item.begin_at),
    author: item.organizer
      ? {
          uuid: item.organizer.uuid ?? item.uuid,
          first_name: item.organizer.first_name,
          last_name: item.organizer.last_name,
          image_url: item.organizer.image_url ?? null,
          role: item.organizer.role ?? null,
          instance: item.organizer.instance ?? null,
          zone: item.organizer.zone ?? null,
        }
      : null,
    description: null,
    editable: item.editable,
    participants: [],
  }
}
