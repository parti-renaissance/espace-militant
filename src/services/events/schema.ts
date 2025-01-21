import { activistTagSchema } from '@/data/Activist/schema'
import { z } from 'zod'
import { createRestPaginationSchema } from '../common/schema'

// ------- Event Schemas ----------

export const EventVisibilitySchema = z.enum(['public', 'private', 'adherent', 'adherent_dues'])

export const RestEventParentCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
})

export const RestEventCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  event_group_category: RestEventParentCategorySchema,
})

export const RestEventStatusSchema = z.enum(['SCHEDULED', 'CANCELLED'])
export const RestEventOrganizerSchema = z.object({
  uuid: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.string().nullable(),
  instance: z.string().nullable(),
  zone: z.string().nullable(),
  image_url: z.string().nullable().optional(),
  scope: z.string().nullable(),
})

export const RestEventComitteeSchema = z.object({
  name: z.string(),
  link: z.string(),
})

export const RestEventAddressSchema = z.object({
  address: z.string().nullable(),
  city: z.string().nullable(),
  city_name: z.string().nullable(),
  postal_code: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
})

export const RestBaseEventSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  slug: z.string(),
  status: RestEventStatusSchema,
  visibility: EventVisibilitySchema,
  begin_at: z.string(),
  finish_at: z.string().nullable(),
  time_zone: z.string(),
  post_address: RestEventAddressSchema.nullable(),
  organizer: RestEventOrganizerSchema.nullable(),
  image: z
    .object({
      url: z.string().nullable(),
      width: z.number().nullable(),
      height: z.number().nullable(),
    })
    .nullable(),
  mode: z.enum(['online', 'meeting']).nullable(),
  category: RestEventCategorySchema.nullable(),
})

export const RestFullEventSchema = z
  .object({
    object_state: z.literal('full'),
    description: z.string(),
    committee: RestEventComitteeSchema.optional(),
    participants_count: z.number(),
    capacity: z.number().nullable(),
    visio_url: z.string().nullable(),
    user_registered_at: z.string().nullable(),
    live_url: z.string().nullable(),
    is_national: z.boolean(),
    editable: z.boolean(),
    edit_link: z.string().optional(),
  })
  .merge(RestBaseEventSchema)

export const RestPartialEventSchema = z
  .object({
    object_state: z.literal('partial'),
  })
  .merge(RestBaseEventSchema)

export const RestEventSchema = z.discriminatedUnion('object_state', [RestFullEventSchema, RestPartialEventSchema])

export const RestPublicEventSchema = z.discriminatedUnion('object_state', [RestFullEventSchema.omit({ user_registered_at: true }), RestPartialEventSchema])
export const RestItemEventSchema = z.discriminatedUnion('object_state', [
  RestFullEventSchema.omit({
    description: true,
  }),
  RestPartialEventSchema,
])

export const RestPublicItemEventSchema = z.discriminatedUnion('object_state', [
  RestFullEventSchema.omit({
    description: true,
    user_registered_at: true,
  }),
  RestPartialEventSchema,
])

export type RestFullEvent = z.infer<typeof RestFullEventSchema>
export type RestPartialEvent = z.infer<typeof RestPartialEventSchema>

export type RestPrivateEvent = z.infer<typeof RestEventSchema>
export type RestPublicEvent = z.infer<typeof RestPublicEventSchema>

export type RestEvent = RestPrivateEvent | RestPublicEvent

export type RestPrivateItemEvent = z.infer<typeof RestItemEventSchema>
export type RestPublicItemEvent = z.infer<typeof RestPublicItemEventSchema>
export type RestItemEvent = RestPrivateItemEvent | RestPublicItemEvent

export const isFullEvent = (event: RestEvent | RestItemEvent): event is RestFullEvent => event.object_state === 'full'
export const isPartialEvent = (event: RestEvent | RestItemEvent): event is RestPartialEvent => event.object_state === 'partial'

// ------------ RestGetEvents --------------

export type RestGetEventsRequest = z.infer<typeof RestGetEventsRequestSchema>
export const RestGetEventsRequestSchema = z
  .object({
    'finishAt[strictly_after]': z.string(),
    name: z.string(),
    mode: z.string(),
    'order[subscriptions]': z.string(),
    'order[beginAt]': z.string(),
    zipCode: z.string(),
    subscribedOnly: z.boolean(),
  })
  .partial()
  .merge(z.object({ page: z.number() }))

export type RestGetEventsResponse = z.infer<typeof RestGetEventsResponseSchema>
export const RestGetEventsResponseSchema = createRestPaginationSchema(RestItemEventSchema)

export type RestGetPublicEventsRequest = z.infer<typeof RestGetPublicEventsResponseSchema>
export const RestGetPublicEventsResponseSchema = createRestPaginationSchema(RestPublicItemEventSchema)

export type RestGetEventDetailsResponse = z.infer<typeof RestGetEventsResponseSchema>
export const RestGetEventDetailsResponseSchema = RestEventSchema

export type RestGetPublicEventDetailsResponse = z.infer<typeof RestGetPublicEventDetailsResponseSchema>
export const RestGetPublicEventDetailsResponseSchema = RestPublicEventSchema

export type RestGetEventDetailsRequest = z.infer<typeof RestGetEventsResponseSchema>
export const RestGetEventDetailsRequestSchema = z.void()

// ------------ Rest Public Subscription --------------

export type RestPostPublicEventSubsciptionRequest = z.infer<typeof RestPostPublicEventSubsciptionRequest>
export const RestPostPublicEventSubsciptionRequest = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email_address: z.string().email(),
  postal_code: z.string().min(4).max(6),
  cgu_accepted: z.boolean(),
  join_newsletter: z.boolean(),
})

// ------------ Rest Event Participants --------------
export const RestEventParticipantsRequest = z.object({ page: z.number(), scope: z.string() })
export const RestEventParticipantsResponse = createRestPaginationSchema(
  z.object({
    uuid: z.string().uuid(),
    image_url: z.string().url().nullable(),
    created_at: z.string().date().nullable(),
    type: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    postal_code: z.string().min(4).max(6).nullable(),
    email_address: z.string().email(),
    phone: z.string().nullable(),
    tags: z.array(activistTagSchema).nullable(),
  }),
)
