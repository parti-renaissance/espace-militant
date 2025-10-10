import { z } from 'zod'

const RestPublicationStatsUniqueClicksSchema = z.object({
  total: z.number(),
  total_rate: z.number(),
})

const RestPublicationStatsUniqueImpressionsSchema = z.object({
  list: z.number(),
  timeline: z.number(),
  total: z.number(),
})

const RestPublicationStatsUniqueOpensSchema = z.object({
  direct_link: z.number(),
  list: z.number(),
  notification: z.number(),
  timeline: z.number(),
  total: z.number(),
  total_rate: z.number(),
})

export const RestPublicationStatsResponseSchema = z.object({
  contacts: z.number(),
  sent_at: z.string(),
  unique_clicks: RestPublicationStatsUniqueClicksSchema,
  unique_emails: z.number(),
  unique_impressions: RestPublicationStatsUniqueImpressionsSchema,
  unique_notifications: z.number(),
  unique_opens: RestPublicationStatsUniqueOpensSchema,
  visible_count: z.number(),
})

export type RestPublicationStatsResponse = z.infer<typeof RestPublicationStatsResponseSchema>
export type RestPublicationStatsUniqueClicks = z.infer<typeof RestPublicationStatsUniqueClicksSchema>
export type RestPublicationStatsUniqueImpressions = z.infer<typeof RestPublicationStatsUniqueImpressionsSchema>
export type RestPublicationStatsUniqueOpens = z.infer<typeof RestPublicationStatsUniqueOpensSchema>

