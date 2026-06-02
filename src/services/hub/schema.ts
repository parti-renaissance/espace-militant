import { z } from 'zod'

import { createRestPaginationSchema } from '@/services/common/schema'
import { EventVisibilitySchema, RestEventAddressSchema, RestEventParentCategorySchema, RestEventStatusSchema } from '@/services/events/schema'

export const RestHubItemTypeSchema = z.enum(['event', 'action'])

export const RestHubItemCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  event_group_category: RestEventParentCategorySchema.nullable(),
})

export const RestHubItemPersonSchema = z.object({
  uuid: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  image_url: z.string().nullable().optional(),
  scope: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  instance: z.string().nullable().optional(),
  zone: z.string().nullable().optional(),
  theme: z.unknown().nullable().optional(),
})

export const RestHubItemStatusSchema = z.union([RestEventStatusSchema, z.enum(['scheduled', 'cancelled'])])

export const RestHubItemImageSchema = z
  .object({
    url: z.string().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
  })
  .nullable()

export const RestHubItemSchema = z.object({
  type: RestHubItemTypeSchema,
  uuid: z.string(),
  name: z.string(),
  slug: z.string().nullable(),
  time_zone: z.string().nullable(),
  begin_at: z.string(),
  finish_at: z.string().nullable(),
  participants_count: z.number().nullish(),
  is_national: z.boolean(),
  status: RestHubItemStatusSchema,
  capacity: z.number().nullable(),
  visio_url: z.string().nullish(),
  mode: z.enum(['online', 'meeting']).nullable(),
  category: RestHubItemCategorySchema.nullable(),
  post_address: RestEventAddressSchema.nullable(),
  visibility: EventVisibilitySchema.nullable(),
  live_url: z.string().nullable(),
  hidden: z.boolean(),
  pinned: z.boolean(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable().optional(),
  author: RestHubItemPersonSchema.nullable().optional(),
  organizer: RestHubItemPersonSchema.nullable(),
  local_begin_at: z.string().nullable(),
  local_finish_at: z.string().nullable(),
  image_url: z.string().nullable(),
  image: RestHubItemImageSchema,
  editable: z.boolean(),
  user_registered_at: z.string().nullish(),
  edit_link: z.string().optional(),
  object_state: z.enum(['full', 'partial']).optional(),
})

export const RestGetHubItemsRequestSchema = z
  .object({
    page_size: z.number(),
    lat: z.number(),
    lng: z.number(),
    zone: z.string(),
    'bbox[ne][lat]': z.number(),
    'bbox[ne][lng]': z.number(),
    'bbox[sw][lat]': z.number(),
    'bbox[sw][lng]': z.number(),
    'beginAt[strictly_after]': z.string(),
    'beginAt[after]': z.string(),
    'beginAt[strictly_before]': z.string(),
    'beginAt[before]': z.string(),
    scope: z.string(),
    subscribedOnly: z.boolean(),
    upcomingOnly: z.boolean(),
    pinned: z.boolean(),
  })
  .partial()
  .merge(z.object({ page: z.number() }))

export const RestGetHubItemsResponseSchema = createRestPaginationSchema(RestHubItemSchema)

// ----------------- Types -----------------

export type RestHubItemType = z.infer<typeof RestHubItemTypeSchema>
export type RestHubItemCategory = z.infer<typeof RestHubItemCategorySchema>
export type RestHubItemPerson = z.infer<typeof RestHubItemPersonSchema>
export type RestHubItem = z.infer<typeof RestHubItemSchema>
export type RestGetHubItemsRequest = z.infer<typeof RestGetHubItemsRequestSchema>
export type RestGetHubItemsResponse = z.infer<typeof RestGetHubItemsResponseSchema>

export const isHubEventItem = (item: RestHubItem): item is RestHubItem & { type: 'event' } => item.type === 'event'
export const isHubActionItem = (item: RestHubItem): item is RestHubItem & { type: 'action' } => item.type === 'action'
