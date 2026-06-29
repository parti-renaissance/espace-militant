import type { RestPublicTimelineFeedItem, RestPublicTimelineFeedResponse, RestTimelineFeedItem, RestTimelineFeedResponse } from '@/services/timeline-feed/schema'

const toNullable = <T>(value: T | null | undefined): T | null => value ?? null

const mapPublicTimelineFeedAuthor = (author: RestPublicTimelineFeedItem['author']): RestTimelineFeedItem['author'] => {
  if (!author) return null

  return {
    first_name: toNullable(author.first_name),
    last_name: toNullable(author.last_name),
    username: author.username,
    role: author.role,
    instance: author.instance,
    zone: author.zone,
    image_url: author.image_url,
    instance_key: author.instance_key,
    uuid: author.uuid,
    scope: author.scope,
    theme: author.theme,
  }
}

export const mapPublicTimelineFeedItem = (item: RestPublicTimelineFeedItem): RestTimelineFeedItem => ({
  objectID: item.objectID ?? item.identifier,
  identifier: toNullable(item.identifier),
  type: item.type,
  title: toNullable(item.title),
  description: toNullable(item.description),
  author: mapPublicTimelineFeedAuthor(item.author),
  date: toNullable(item.date),
  begin_at: toNullable(item.begin_at),
  finish_at: toNullable(item.finish_at),
  image: item.image ?? null,
  address: toNullable(item.address),
  category: toNullable(item.category),
  is_national: toNullable(item.is_national),
  media_type: item.media_type,
  cta_link: item.cta_link,
  cta_label: item.cta_label,
  editable: item.editable,
  url: item.url,
  capacity: item.capacity,
  user_registered_at: item.user_registered_at,
  time_zone: toNullable(item.time_zone),
  mode: item.mode,
  post_address: item.post_address,
  object_state: item.object_state,
  visibility: item.visibility,
  live_url: item.live_url,
  participants_count: item.participants_count,
  zone_codes: item.zone_codes,
  committee_uuid: item.committee_uuid,
  agora_uuid: item.agora_uuid,
  media: item.media,
  access: item.access,
})

export const mapPublicTimelineFeedResponse = (response: RestPublicTimelineFeedResponse): RestTimelineFeedResponse => ({
  ...response,
  hits: response.hits.map(mapPublicTimelineFeedItem),
})
