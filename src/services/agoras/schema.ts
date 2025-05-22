import z from 'zod'

export const AgoraMemberSchema = z.object({
  uuid: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  id: z.string(),
  image_url: z.string().url().nullable(),
})

export const AgoraSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  max_members_count: z.number(),
  members_count: z.number(),
  published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  president: AgoraMemberSchema,
  general_secretaries: z.array(AgoraMemberSchema),
})

export const RestGetAgorasResponseSchema = z.object({
  metadata: z.object({
    total_items: z.number(),
    items_per_page: z.number(),
    count: z.number(),
    current_page: z.number(),
    last_page: z.number(),
  }),
  items: z.array(AgoraSchema),
})
export type RestGetAgorasResponse = z.infer<typeof RestGetAgorasResponseSchema>

export const RestGetAgorasRequestSchema = z.object({
  page: z.number().optional(),
})
export type RestGetAgorasRequest = z.infer<typeof RestGetAgorasRequestSchema>

export const RestSetMyAgoraRequestSchema = z.void()
export type RestSetMyAgoraRequest = z.infer<typeof RestSetMyAgoraRequestSchema>

export const RestSetMyAgoraResponseSchema = z.any()
export type RestSetMyAgoraResponse = z.infer<typeof RestSetMyAgoraResponseSchema>
