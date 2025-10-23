import { z } from 'zod'

const RestPublicationStatsUniqueClicksSchema = z.object({
  app: z.number(),
  app_rate: z.number(),
  email: z.number(),
  email_rate: z.number(),
  total: z.number(),
  total_rate: z.number(),
})

const RestPublicationStatsUniqueImpressionsSchema = z.object({
  list: z.number(),
  timeline: z.number(),
  total: z.number(),
})

const RestPublicationStatsUniqueOpensSchema = z.object({
  app: z.number(),
  app_rate: z.number(),
  direct_link: z.number(),
  email: z.number(),
  email_rate: z.number(),
  list: z.number(),
  notification: z.number(),
  notification_rate: z.number(),
  timeline: z.number(),
  total: z.number(),
  total_rate: z.number(),
})

const RestPublicationStatsUnsubscribedSchema = z.object({
  total: z.number(),
  total_rate: z.number(),
})

const RestPublicationStatsNotificationsSchema = z.object({
  android: z.number(),
  ios: z.number(),
  web: z.number(),
})

export const RestPublicationStatsResponseSchema = z.object({
  contacts: z.number(),
  notifications: RestPublicationStatsNotificationsSchema,
  sent_at: z.string(),
  unique_clicks: RestPublicationStatsUniqueClicksSchema,
  unique_emails: z.number(),
  unique_impressions: RestPublicationStatsUniqueImpressionsSchema,
  unique_notifications: z.number(),
  unique_opens: RestPublicationStatsUniqueOpensSchema,
  unsubscribed: RestPublicationStatsUnsubscribedSchema,
  visible_count: z.number(),
})

export type RestPublicationStatsResponse = z.infer<typeof RestPublicationStatsResponseSchema>
export type RestPublicationStatsUniqueClicks = z.infer<typeof RestPublicationStatsUniqueClicksSchema>
export type RestPublicationStatsUniqueImpressions = z.infer<typeof RestPublicationStatsUniqueImpressionsSchema>
export type RestPublicationStatsUniqueOpens = z.infer<typeof RestPublicationStatsUniqueOpensSchema>
export type RestPublicationStatsUnsubscribed = z.infer<typeof RestPublicationStatsUnsubscribedSchema>
export type RestPublicationStatsNotifications = z.infer<typeof RestPublicationStatsNotificationsSchema>

const RestEventStatsUniqueImpressionsSchema = z.object({
  list: z.number(),
  timeline: z.number(),
  total: z.number(),
})

const RestEventStatsUniqueOpensSchema = z.object({
  direct_link: z.number(),
  list: z.number(),
  notification: z.number(),
  timeline: z.number(),
  total: z.number(),
})

export const RestEventStatsResponseSchema = z.object({
  unique_impressions: RestEventStatsUniqueImpressionsSchema,
  unique_opens: RestEventStatsUniqueOpensSchema,
})

export type RestEventStatsResponse = z.infer<typeof RestEventStatsResponseSchema>
export type RestEventStatsUniqueImpressions = z.infer<typeof RestEventStatsUniqueImpressionsSchema>
export type RestEventStatsUniqueOpens = z.infer<typeof RestEventStatsUniqueOpensSchema>

