import z from 'zod'

import { createRestPaginationSchema } from '@/services/common/schema'

const RestAdherentTagSchema = z.object({
  code: z.string().optional(),
  label: z.string(),
  type: z.string().optional(),
  tooltip: z.string().nullish(),
})

const RestAdherentZoneSchema = z.object({
  uuid: z.string(),
  type: z.string(),
  code: z.string(),
  name: z.string(),
})

export const RestAdherentListItemSchema = z.object({
  adherent_uuid: z.string(),
  public_id: z.string(),
  email: z.string(),
  address: z.string().nullable(),
  postal_code: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  gender: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  birthdate: z.string().nullable(),
  age: z.number().nullable(),
  phone: z.string().nullable(),
  nationality: z.string().nullable(),
  tags: z.array(RestAdherentTagSchema),
  created_at: z.string(),
  interests: z.array(z.unknown()),
  last_membership_donation: z.string().nullable(),
  first_membership_donation: z.string().nullable(),
  committee: z.string().nullable(),
  committee_uuid: z.string().nullable(),
  agora: z.string().nullable(),
  agora_uuid: z.string().nullable(),
  mandates: z.array(z.string()),
  declared_mandates: z.array(z.string()),
  cotisation_dates: z.array(z.string()),
  campus_registered_at: z.string().nullable(),
  zones: z.array(RestAdherentZoneSchema),
  available_for_resubscribe_email: z.boolean(),
  certified: z.boolean(),
  city_code: z.string().nullable(),
  sms_subscription: z.boolean(),
  email_subscription: z.boolean(),
  image_url: z.string().url().nullable(),
})

export const RestAdherentListResponseSchema = createRestPaginationSchema(RestAdherentListItemSchema)

/** Query params pour GET /api/v3/adherents (scope + pagination) */
export const RestAdherentListRequestSchema = z.object({
  scope: z.string(),
  page: z.number().optional(),
  page_size: z.number().optional(),
})

export type RestAdherentListRequest = z.infer<typeof RestAdherentListRequestSchema>

export type RestAdherentTag = z.infer<typeof RestAdherentTagSchema>
export type RestAdherentZone = z.infer<typeof RestAdherentZoneSchema>
export type RestAdherentListItem = z.infer<typeof RestAdherentListItemSchema>
export type RestAdherentListResponse = z.infer<typeof RestAdherentListResponseSchema>
