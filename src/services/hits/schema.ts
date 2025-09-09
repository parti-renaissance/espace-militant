import { z } from 'zod'

export const EVENT_TYPES = ['activity_session', 'impression', 'open', 'click'] as const
export type EventType = (typeof EVENT_TYPES)[number]

export const OBJECT_TYPES = ['publication', 'event', 'action', 'alert', 'resource', 'questionnaire', 'news'] as const
export type ObjectType = (typeof OBJECT_TYPES)[number] | string

export type AppSystem = 'ios' | 'android' | 'web'

const BaseHitSchema = z.object({
  event_type: z.enum(EVENT_TYPES),
  activity_session_uuid: z.string(),
  app_date: z.string(),
  app_version: z.string(),
  app_system: z.enum(['ios', 'android', 'web']),
  user_agent: z.string().optional(),
})

export const ActivitySessionHitSchema = BaseHitSchema.extend({
  event_type: z.literal('activity_session'),
}).strip()

export const ObjectHitSchema = BaseHitSchema.extend({
  event_type: z.union([z.literal('impression'), z.literal('open'), z.literal('click')]),
  object_type: z.string().nullable().optional(),
  object_id: z.string().optional(),
  target_url: z.string().optional(),
  button_name: z.string().optional(),
  source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  referrer_code: z.string().optional(),
}).strip()

export const HitPayloadSchema = z.union([ActivitySessionHitSchema, ObjectHitSchema])

export type HitPayload = z.infer<typeof HitPayloadSchema>


