import { RestFullEvent } from '@/services/events/schema'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'

export const map = (x: RestTimelineFeedItem): Partial<RestFullEvent> & { uuid: string; slug: string } => {
  return {
    uuid: x.objectID,
    slug: x.identifier!,
    name: x.title ?? undefined,
    editable: x.editable ?? undefined,
    edit_link: x.edit_link,
    post_address: (x.post_address ?? undefined) as RestFullEvent['post_address'],
    organizer: x.author as RestFullEvent['organizer'],
    category: {
      name: x.category!,
    } as RestFullEvent['category'],
    begin_at: x.begin_at ?? undefined,
    finish_at: x.finish_at ?? undefined,
    image: x.image ?? undefined,
    description: x.description ?? undefined,
    time_zone: x.time_zone ?? undefined,
    user_registered_at: x.user_registered_at ?? undefined,
    capacity: x.capacity,
    live_url: x.live_url ?? undefined,
    is_local: x.is_local ?? undefined,
    //@ts-expect-error descrininate union on that
    object_state: x.object_state,
    visibility: x.visibility as RestFullEvent['visibility'],
    mode: x.mode,
  }
}
