import z from 'zod'
import { createRestPaginationSchema } from '../common/schema'

export const AgoraMemberSchema = z.object({
  uuid: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  id: z.string(),
  role: z.string().nullable(),
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
})

export const RestGetAgorasResponseSchema = createRestPaginationSchema(AgoraSchema)
export type RestGetAgorasResponse = z.infer<typeof RestGetAgorasResponseSchema>

export const RestGetAgorasRequestSchema = z.object({
  page: z.number().optional(),
})
export type RestGetAgorasRequest = z.infer<typeof RestGetAgorasRequestSchema>

export const RestSetMyAgoraRequestSchema = z.void()
export type RestSetMyAgoraRequest = z.infer<typeof RestSetMyAgoraRequestSchema>

export const RestSetMyAgoraResponseSchema = z.any()
export type RestSetMyAgoraResponse = z.infer<typeof RestSetMyAgoraResponseSchema>

export const RestLeaveMyAgoraRequestSchema = z.void()
export type RestLeaveMyAgoraRequest = z.infer<typeof RestSetMyAgoraRequestSchema>

export const RestLeaveMyAgoraResponseSchema = z.any()
export type RestLeaveMyAgoraResponse = z.infer<typeof RestSetMyAgoraResponseSchema>