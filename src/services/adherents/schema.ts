import z from 'zod'

import { createRestPaginationSchema } from '@/services/common/schema'

/** Tag commun (adherent_tags, static_tags, elect_tags) */
export const RestAdherentTagSchema = z.object({
  code: z.string(),
  label: z.string(),
})

/** Instance (assembly, circonscription, committee) */
export const RestAdherentInstanceSchema = z.object({
  type: z.string(),
  code: z.string().optional(),
  name: z.string(),
  uuid: z.string().optional(),
})

/** Canal d'abonnement */
const RestSubscriptionChannelSchema = z.object({
  available: z.boolean(),
  subscribed: z.boolean(),
})

/** Abonnements (mobile, web, sms, email) */
export const RestSubscriptionsSchema = z.object({
  mobile: RestSubscriptionChannelSchema,
  web: RestSubscriptionChannelSchema,
  sms: RestSubscriptionChannelSchema,
  email: RestSubscriptionChannelSchema,
})

/** Rôle avec délégation (API peut renvoyer is_delegated en 0/1) */
export const RestAdherentRoleSchema = z.object({
  code: z.string(),
  label: z.string(),
  is_delegated: z.union([z.boolean(), z.number()]).transform((x) => Boolean(x)),
  function: z.string().nullable(),
})

/** Item liste GET /api/v3/adherents (split tags + roles) */
export const RestAdherentListItemSchema = z.object({
  uuid: z.string(),
  public_id: z.string().nullable(),
  civility: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  age: z.number().nullable(),
  birthdate: z.string().nullable(),
  image_url: z.string().nullable(),
  account_created_at: z.string().nullable(),
  first_contribution_at: z.string().nullable(),
  last_activity_at: z.string().nullable(),
  adherent_tags: z.array(RestAdherentTagSchema).nullable(),
  static_tags: z.array(RestAdherentTagSchema).nullable(),
  elect_tags: z.array(RestAdherentTagSchema).nullable(),
  instances: z.array(RestAdherentInstanceSchema).default([]),
  subscriptions: RestSubscriptionsSchema,
  roles: z.array(RestAdherentRoleSchema).default([]),
})

export const RestAdherentListResponseSchema = createRestPaginationSchema(RestAdherentListItemSchema)

export const RestAdherentListRequestSchema = z
  .object({
    scope: z.string(),
    page: z.number().optional(),
    page_size: z.number().optional(),
  })
  .passthrough()

const RestSubscriptionTypeSchema = z.object({
  code: z.string(),
  label: z.string(),
  checked: z.boolean(),
})

const RestSessionSchema = z.object({
  type: z.string(),
  device: z.string().nullable(),
  active_since: z.string().nullable(),
  last_activity_at: z.string().nullable(),
  subscribed: z.boolean(),
})

const RestSocialLinksSchema = z.object({
  facebook: z.string().nullable(),
  twitter: z.string().nullable(),
  instagram: z.string().nullable(),
  linkedin: z.string().nullable(),
  telegram: z.string().nullable(),
})

/** Réponse détail GET /api/v3/adherents/:uuid */
export const RestAdherentDetailSchema = z.object({
  uuid: z.string(),
  public_id: z.string().nullable(),
  civility: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  age: z.number().nullable(),
  birthdate: z.string().nullable(),
  image_url: z.string().nullable(),
  account_created_at: z.string().nullable(),
  first_contribution_at: z.string().nullable(),
  last_activity_at: z.string().nullable(),
  adherent_tags: z.array(RestAdherentTagSchema).nullable(),
  static_tags: z.array(RestAdherentTagSchema).nullable(),
  elect_tags: z.array(RestAdherentTagSchema).nullable(),
  instances: z.array(RestAdherentInstanceSchema).default([]),
  subscriptions: RestSubscriptionsSchema,
  subscription_types: z.array(RestSubscriptionTypeSchema).default([]),
  roles: z.array(RestAdherentRoleSchema).default([]),
  sessions: z.array(RestSessionSchema).default([]),
  social_links: RestSocialLinksSchema.optional(),
  available_for_resubscribe_email: z.boolean(),
})

/** Query params GET /api/v3/adherents/:uuid */
export const RestAdherentDetailRequestSchema = z.object({
  scope: z.string(),
})

export type RestAdherentTag = z.infer<typeof RestAdherentTagSchema>
export type RestAdherentInstance = z.infer<typeof RestAdherentInstanceSchema>
export type RestSubscriptions = z.infer<typeof RestSubscriptionsSchema>
export type RestAdherentRole = z.infer<typeof RestAdherentRoleSchema>
export type RestAdherentListItem = z.infer<typeof RestAdherentListItemSchema>
export type RestAdherentListResponse = z.infer<typeof RestAdherentListResponseSchema>
export type RestAdherentListRequest = z.infer<typeof RestAdherentListRequestSchema>
export type RestAdherentDetail = z.infer<typeof RestAdherentDetailSchema>
export type RestAdherentDetailRequest = z.infer<typeof RestAdherentDetailRequestSchema>
