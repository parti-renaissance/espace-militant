import type { ActionVoxCardProps } from '@/components/Cards/ActionCard'
import { isFullAction, RestAction, RestActionFull } from '@/services/actions/schema'

export function mapPayload(action: RestAction | RestActionFull): ActionVoxCardProps['payload'] {
  return {
    id: action.uuid,
    tag: action.type,
    isSubscribed: Boolean(action.user_registered_at),
    date: {
      start: action.date,
      end: action.date,
    },
    status: action.status,
    location: {
      city: action.post_address.city_name,
      street: action.post_address.address,
      postalCode: action.post_address.postal_code,
    },
    author: action.author
      ? {
          name: `${action.author.first_name} ${action.author.last_name}`,
          role: action.author.role ?? null,
          title: action.author.instance ?? null,
          pictureLink: action.author.image_url ?? undefined,
          zone: action.author.zone ?? null,
        }
      : undefined,
    attendees: isFullAction(action)
      ? undefined
      : {
          count: action.participants_count,
          pictures: action.first_participants.map((x) => x.adherent),
        },
  }
}
