import z from 'zod'
import { createRestPaginationSchema } from '@/services/common/schema'

export const RestPostMessageRequestSchema = z.object({
  type: z.string(),
  label: z.string(),
  subject: z.string(),
  content: z.string(),
  json_content: z.string(),
})

export type RestPostMessageRequest = z.infer<typeof RestPostMessageRequestSchema>

export const RestPostMessageResponseSchema = z.object({
  uuid: z.string(),
  author: z.object({
    uuid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    image_url: z.string().url().optional(),
    scope: z.string().optional(),
  }),
  label: z.string(),
  subject: z.string(),
  status: z.string(),
  recipient_count: z.number(),
  source: z.string(),
  synchronized: z.boolean(),
  preview_link: z.string().nullable(),
})

export const RestGetMessageContentResponseSchema = z.object({
  uuid: z.string(),
  content: z.string(),
  subject: z.string(),
  json_content: z.string(),
})

export type RestGetMessageContentResponse = z.infer<typeof RestGetMessageContentResponseSchema>

export type RestPostMessageResponse = z.infer<typeof RestPostMessageResponseSchema>

export const RestAvailableSenderThemeSchema = z.object({
  primary: z.string(),
  soft: z.string(),
  hover: z.string(),
  active: z.string(),
})

export const RestSenderSchema = z.object({
  uuid: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  image_url: z.string().nullish(),
  scope: z.string().nullish(),
  instance: z.string().nullish(),
  zone: z.string().nullish(),
  role: z.string().nullish(),
  theme: RestAvailableSenderThemeSchema.nullable(),
})

export const RestMessageListItemSchema = z.object({
  author: z.object({
    uuid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  sender: RestSenderSchema.nullable(),
  label: z.string(),
  subject: z.string(),
  status: z.string(),
  sent_at: z.string().nullable(),
  recipient_count: z.number(),
  source: z.string(),
  uuid: z.string(),
  created_at: z.string(),
  synchronized: z.boolean(),
  from_name: z.string(),
  statistics: z.object({
    sent: z.number(),
    opens: z.number(),
    open_rate: z.number(),
    clicks: z.number(),
    click_rate: z.number(),
    unsubscribe: z.number(),
    unsubscribe_rate: z.number(),
  }),
  preview_link: z.string().nullable(),
})

export const RestMessageListResponseSchema = createRestPaginationSchema(RestMessageListItemSchema)

export type RestMessageListItem = z.infer<typeof RestMessageListItemSchema>
export type RestMessageListResponse = z.infer<typeof RestMessageListResponseSchema>

export const RestMessageCountRecipientsResponseSchema = z.object({
  push: z.number().optional(),
  email: z.number().optional(),
  push_email: z.number().optional(),
  only_push: z.number().optional(),
  only_email: z.number().optional(),
  contacts: z.number().optional(),
  total: z.number().optional(),
})

export type RestMessageCountRecipientsResponse = z.infer<typeof RestMessageCountRecipientsResponseSchema>

export const RestAvailableSendersResponseSchema = z.array(RestSenderSchema)

export type RestAvailableSender = z.infer<typeof RestSenderSchema>
export type RestAvailableSendersResponse = z.infer<typeof RestAvailableSendersResponseSchema>
export type RestAvailableSenderTheme = z.infer<typeof RestAvailableSenderThemeSchema>

export const RestGetMessageResponseSchema = z.object({
  author: z.object({
    uuid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    scope: z.string().nullish(),
  }),
  sender: RestSenderSchema,
  label: z.string(),
  subject: z.string(),
  status: z.string(),
  recipient_count: z.number(),
  source: z.string(),
  uuid: z.string(),
  updated_at: z.string(),
  synchronized: z.boolean(),
  preview_link: z.string().nullable(),
  json_content: z.string().nullish(),
})

export type RestGetMessageResponse = z.infer<typeof RestGetMessageResponseSchema>

export const RestGetMessageFiltersResponseSchema = z.object({
  is_certified: z.boolean().nullable(),
  zone: z.object({
    uuid: z.string(),
    type: z.string(),
    code: z.string(),
    name: z.string(),
  }).nullable(),
  committee: z.string().nullable(),
  is_committee_member: z.boolean().nullable(),
  mandate_type: z.string().nullable(),
  declared_mandate: z.string().nullable(),
  is_campus_registered: z.boolean().nullable(),
  donator_status: z.string().nullable(),
  adherent_tags: z.string().nullable(),
  elect_tags: z.string().nullable(),
  static_tags: z.string().nullable(),
  zones: z.array(z.object({
    uuid: z.string(),
    type: z.string(),
    code: z.string(),
    name: z.string(),
  })).nullable(),
  gender: z.string().nullable(),
  age_min: z.number().nullable(),
  age_max: z.number().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  registered_since: z.string().nullable(),
  registered_until: z.string().nullable(),
  first_membership_since: z.string().nullable(),
  first_membership_before: z.string().nullable(),
  last_membership_since: z.string().nullable(),
  last_membership_before: z.string().nullable(),
}).passthrough() // Permet d'ajouter des champs supplémentaires

export type RestGetMessageFiltersResponse = z.infer<typeof RestGetMessageFiltersResponseSchema>

export const RestPutMessageFiltersRequestSchema = z.object({
  is_certified: z.boolean().nullable().optional(),
  zone: z.string().nullable().optional(),
  committee: z.string().nullable().optional(),
  is_committee_member: z.boolean().nullable().optional(),
  mandate_type: z.string().nullable().optional(),
  declared_mandate: z.string().nullable().optional(),
  is_campus_registered: z.boolean().nullable().optional(),
  donator_status: z.string().nullable().optional(),
  adherent_tags: z.string().nullable().optional(),
  elect_tags: z.string().nullable().optional(),
  static_tags: z.string().nullable().optional(),
  zones: z
    .array(
      z.object({
        uuid: z.string(),
        type: z.string(),
        code: z.string(),
        name: z.string(),
      })
    )
    .nullable()
    .optional(),
  gender: z.string().nullable().optional(),
  age_min: z.number().nullable().optional(),
  age_max: z.number().nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  registered_since: z.string().nullable().optional(),
  registered_until: z.string().nullable().optional(),
  first_membership_since: z.string().nullable().optional(),
  first_membership_before: z.string().nullable().optional(),
  last_membership_since: z.string().nullable().optional(),
  last_membership_before: z.string().nullable().optional(),
}).passthrough()

export type RestPutMessageFiltersRequest = z.infer<typeof RestPutMessageFiltersRequestSchema>

// Filter collection schemas
export const RestFilterOptionChoicesSchema = z.record(z.string(), z.string())

export const RestFilterOptionIntegerIntervalSchema = z.object({
  first: z.object({
    min: z.number(),
    max: z.number(),
  }),
  second: z.object({
    min: z.number(),
    max: z.number(),
  }),
})

export const RestFilterOptionZoneAutocompleteSchema = z.object({
  url: z.string(),
  query_param: z.string(),
  value_param: z.string(),
  label_param: z.string(),
  multiple: z.boolean(),
  required: z.boolean(),
})

export const RestFilterOptionSelectSchema = z.object({
  choices: z.union([RestFilterOptionChoicesSchema, z.array(z.string())]),
  multiple: z.boolean().optional(),
  required: z.boolean().optional(),
  favorite: z.boolean().optional(),
  advanced: z.boolean().optional(),
  placeholder: z.string().optional(),
})

export const RestFilterSchema = z.object({
  code: z.string(),
  label: z.string(),
  options: z.union([
    RestFilterOptionSelectSchema,
    RestFilterOptionIntegerIntervalSchema,
    RestFilterOptionZoneAutocompleteSchema,
    z.null(),
  ]),
  type: z.enum(['select', 'text', 'integer_interval', 'date_interval', 'date', 'zone_autocomplete']),
})

export const RestFilterCategorySchema = z.object({
  label: z.string(),
  color: z.string(),
  filters: z.array(RestFilterSchema),
})

export const RestFilterCollectionResponseSchema = z.array(RestFilterCategorySchema)

export type RestFilterOptionChoices = z.infer<typeof RestFilterOptionChoicesSchema>
export type RestFilterOptionIntegerInterval = z.infer<typeof RestFilterOptionIntegerIntervalSchema>
export type RestFilterOptionZoneAutocomplete = z.infer<typeof RestFilterOptionZoneAutocompleteSchema>
export type RestFilterOptionSelect = z.infer<typeof RestFilterOptionSelectSchema>
export type RestFilter = z.infer<typeof RestFilterSchema>
export type RestFilterCategory = z.infer<typeof RestFilterCategorySchema>
export type RestFilterCollectionResponse = z.infer<typeof RestFilterCollectionResponseSchema>
