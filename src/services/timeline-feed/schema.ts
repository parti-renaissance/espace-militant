import { z } from 'zod'

export type RestTimelineFeedRequest = z.infer<typeof RestTimelineFeedRequestSchema>
export const RestTimelineFeedRequestSchema = z.object({ page: z.number() })

export type RestTimelineFeedAddress = z.infer<typeof RestTimelineFeedAddressSchema>
export const RestTimelineFeedAddressSchema = z.object({
  address: z.string().nullable(),
  city_name: z.string().nullable(),
  postal_code: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
})

export type RestTimelineFeedSocialMediaPhoto = z.infer<typeof RestTimelineFeedSocialMediaPhotoSchema>
export const RestTimelineFeedSocialMediaPhotoSchema = z.object({
  type: z.literal('photo'),
  url: z.string(),
  width: z.number(),
  height: z.number(),
})

export type RestTimelineFeedSocialMediaVideo = z.infer<typeof RestTimelineFeedSocialMediaVideoSchema>
export const RestTimelineFeedSocialMediaVideoSchema = z.object({
  type: z.literal('video'),
  hls_url: z.string(),
  preview_url: z.string().optional(),
  thumbnail_url: z.string(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  duration: z.number().nullable().optional(),
})

export type RestTimelineFeedSocialMediaItem = z.infer<typeof RestTimelineFeedSocialMediaItemSchema>
export const RestTimelineFeedSocialMediaItemSchema = z.union([
  RestTimelineFeedSocialMediaPhotoSchema,
  RestTimelineFeedSocialMediaVideoSchema,
])

export type RestTimelineFeedSocialMedia = z.infer<typeof RestTimelineFeedSocialMediaSchema>
export const RestTimelineFeedSocialMediaSchema = z.object({
  network: z.enum(['twitter', 'instagram']),
  type: z.string(),
  items: z.array(RestTimelineFeedSocialMediaItemSchema),
})

export type RestTimelineFeedAuthor = z.infer<typeof RestTimelineFeedAuthorSchema>
export const RestTimelineFeedAuthorSchema = z.object({
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  username: z.string().nullish(),
  role: z.string().nullish(),
  instance: z.string().nullish(),
  zone: z.string().nullish(),
  image_url: z.string().nullish(),
  instance_key: z.string().nullish(),
  uuid: z.string().nullish(),
  scope: z.string().nullish(),
  theme: z.object({
    soft: z.string().nullish(),
    hover: z.string().nullish(),
    active: z.string().nullish(),
    primary: z.string().nullish(),
  }).nullish(),
})

export type RestTimelineFeedItem = z.infer<typeof RestTimelineFeedItemSchema>
export const RestTimelineFeedItemSchema = z.object({
  objectID: z.string(),
  identifier: z.string().nullable(),
  type: z.enum([
    'news',
    'event',
    'phoning-campaign',
    'pap-campaign',
    'survey',
    'riposte',
    'action',
    'publication',
    'transactional_message',
    'social_network_post',
  ]),
  title: z.string().nullable(),
  description: z.string().nullable(),
  author: RestTimelineFeedAuthorSchema.nullable().optional(),
  date: z.string().nullable(),
  begin_at: z.string().nullable(),
  finish_at: z.string().nullable(),
  image: z
    .object({
      url: z.string().nullable(),
      width: z.number().nullable(),
      height: z.number().nullable(),
    })
    .nullable(),
  address: z.string().nullable(),
  category: z.string().nullable(),
  is_national: z.boolean().nullable(),
  media_type: z.string().nullable().optional(),
  cta_link: z.string().nullable().optional(),
  cta_label: z.string().nullable().optional(),
  editable: z.boolean().nullish(),
  url: z.string().nullable().optional(),
  capacity: z.number().nullish(),
  user_registered_at: z.string().nullable().optional(),
  time_zone: z.string().nullable(),
  mode: z.enum(['meeting', 'online']).nullable().optional(),
  post_address: RestTimelineFeedAddressSchema.nullable().optional(),
  object_state: z.enum(['full', 'partial']).nullish(),
  visibility: z.string().nullish(),
  live_url: z.string().nullish(),
  participants_count: z.number().nullish(),
  zone_codes: z.union([z.array(z.string()), z.array(z.array(z.string()))]).nullish(),
  committee_uuid: z.string().nullish(),
  agora_uuid: z.string().nullish(),
  media: RestTimelineFeedSocialMediaSchema.nullable().optional(),
  access: z
    .object({
      author_id: z.union([z.string(), z.null()]).optional(),
      team_owner_id: z.union([z.string(), z.null()]).optional(),
    })
    .nullish(),
})

export type RestTimelineFeedResponse = z.infer<typeof RestTimelineFeedResponseSchema>
export const RestTimelineFeedResponseSchema = z.object({
  hits: z.array(RestTimelineFeedItemSchema),
  page: z.number(),
  nbHits: z.number(),
  nbPages: z.number(),
  hitsPerPage: z.number(),
  params: z.string().optional(),
})

export type RestPublicTimelineFeedItem = z.infer<typeof RestPublicTimelineFeedItemSchema>
export const RestPublicTimelineFeedItemSchema = z.object({
  identifier: z.string(),
  objectID: z.string().optional(),
  type: RestTimelineFeedItemSchema.shape.type,
  title: z.string().nullish(),
  description: z.string().nullish(),
  author: RestTimelineFeedAuthorSchema.nullish(),
  date: z.string().nullish(),
  begin_at: z.string().nullish(),
  finish_at: z.string().nullish(),
  image: RestTimelineFeedItemSchema.shape.image.nullish(),
  address: z.string().nullish(),
  category: z.string().nullish(),
  is_national: z.boolean().nullish(),
  media_type: z.string().nullish(),
  cta_link: z.string().nullish(),
  cta_label: z.string().nullish(),
  editable: z.boolean().nullish(),
  url: z.string().nullish(),
  capacity: z.number().nullish(),
  user_registered_at: z.string().nullish(),
  time_zone: z.string().nullish(),
  mode: z.enum(['meeting', 'online']).nullish(),
  post_address: RestTimelineFeedAddressSchema.nullish(),
  object_state: z.enum(['full', 'partial']).nullish(),
  visibility: z.string().nullish(),
  live_url: z.string().nullish(),
  participants_count: z.number().nullish(),
  zone_codes: z.union([z.array(z.string()), z.array(z.array(z.string()))]).nullish(),
  committee_uuid: z.string().nullish(),
  agora_uuid: z.string().nullish(),
  media: RestTimelineFeedSocialMediaSchema.nullish(),
  access: RestTimelineFeedItemSchema.shape.access,
})

export type RestPublicTimelineFeedResponse = z.infer<typeof RestPublicTimelineFeedResponseSchema>
export const RestPublicTimelineFeedResponseSchema = z.object({
  hits: z.array(RestPublicTimelineFeedItemSchema),
  page: z.number(),
  nbHits: z.number(),
  nbPages: z.number(),
  hitsPerPage: z.number(),
  params: z.string().optional(),
})
