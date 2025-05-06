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
    is_national: x.is_national ?? undefined,
    //@ts-expect-error descrininate union on that
    object_state: x.object_state,
    visibility: x.visibility as RestFullEvent['visibility'],
    mode: x.mode,
    participants_count: x.participants_count ?? undefined,
  }
}

export const mapEventToFeed = (x: Partial<RestFullEvent>): Partial<RestTimelineFeedItem> => {
  const mapper = {
    objectID: x.uuid,
    identifier: x.slug,
    title: x.name,
    editable: x.editable,
    edit_link: x.edit_link,
    post_address: x.post_address,
    author: x.organizer,
    category: x.category?.name,
    begin_at: x.begin_at,
    finish_at: x.finish_at,
    image: x.image,
    description: x.description,
    time_zone: x.time_zone,
    user_registered_at: x.user_registered_at,
    capacity: x.capacity,
    object_state: x.object_state,
    visibility: x.visibility,
    mode: x.mode,
  }

  return Object.fromEntries(Object.entries(mapper).filter(([, v]) => Boolean(v)))
}
