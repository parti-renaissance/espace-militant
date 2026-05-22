import type { IconComponent } from '@/models/common.model'
import { ClipboardCheck, DoorOpen, Layers3, Mailbox, Paintbrush } from '@tamagui/lucide-icons'
import { z } from 'zod'

// ---------- Enums & labels ----------

export enum ActionType {
  PAP = 'pap',
  BOITAGE = 'boitage',
  TRACTAGE = 'tractage',
  COLLAGE = 'collage',
  QUESTIONNAIRE = 'questionnaire',
}

export enum ActionStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

export const ReadableActionType: Record<ActionType, string> = {
  [ActionType.PAP]: 'Porte à Porte',
  [ActionType.BOITAGE]: 'Boîtage',
  [ActionType.TRACTAGE]: 'Tractage',
  [ActionType.COLLAGE]: 'Collage',
  [ActionType.QUESTIONNAIRE]: 'Questionnaire de terrain',
}

export const ActionTypeIcon: Record<ActionType, IconComponent> = {
  [ActionType.PAP]: DoorOpen,
  [ActionType.BOITAGE]: Mailbox,
  [ActionType.TRACTAGE]: Layers3,
  [ActionType.COLLAGE]: Paintbrush,
  [ActionType.QUESTIONNAIRE]: ClipboardCheck,
}

// ---------- Shared fragments ----------

const ActionTypeSchema = z.nativeEnum(ActionType)
const ActionStatusSchema = z.nativeEnum(ActionStatus)

export const RestActionAuthorSchema = z.object({
  uuid: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  image_url: z.string().url().nullish(),
  role: z.string().nullish(),
  instance: z.string().nullish(),
  zone: z.string().nullish(),
})

export const RestActionAddressSchema = z.object({
  address: z.string(),
  postal_code: z.string(),
  city: z.string().nullable(),
  city_name: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

export const RestActionParticipantSchema = z.object({
  is_present: z.boolean(),
  adherent: RestActionAuthorSchema,
  uuid: z.string().uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export const RestActionPostAddressInputSchema = z.object({
  address: z.string(),
  postal_code: z.string(),
  city_name: z.string(),
  country: z.string(),
})

// ---------- Entities ----------

export const RestActionSchema = z.object({
  type: ActionTypeSchema,
  date: z.coerce.date(),
  status: ActionStatusSchema,
  uuid: z.string().uuid(),
  post_address: RestActionAddressSchema,
  user_registered_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  author: RestActionAuthorSchema.nullish(),
  participants_count: z.number(),
  first_participants: z.array(RestActionParticipantSchema),
})

export const RestActionFullSchema = RestActionSchema.omit({ first_participants: true, participants_count: true }).merge(
  z.object({
    description: z.string().nullable(),
    editable: z.boolean(),
    participants: z.array(RestActionParticipantSchema),
  }),
)

// ---------- Requests / responses ----------

export const RestGetActionRequestSchema = z.object({
  id: z.string().uuid(),
})

export const RestGetActionResponseSchema = RestActionFullSchema

export const RestPostActionRequestSchema = z.object({
  type: ActionTypeSchema,
  date: z.string(),
  description: z.string(),
  post_address: RestActionPostAddressInputSchema,
  send_invitation_email: z.boolean().optional(),
})

export const RestPostActionResponseSchema = RestActionFullSchema

export const RestPutActionRequestSchema = RestPostActionRequestSchema

export const RestPutActionResponseSchema = RestActionFullSchema

export const RestPutActionCancelRequestSchema = z.object({
  id: z.string().uuid(),
})

export const propertyPathPostActionSchema = z.enum([
  'type',
  'date',
  'description',
  'send_invitation_email',
  'post_address',
  'post_address.address',
  'post_address.postal_code',
  'post_address.city_name',
  'post_address.country',
])

// ---------- Type guards ----------

export const isFullAction = (action: RestAction | RestActionFull): action is RestActionFull => {
  return Object.hasOwn(action, 'description') && Object.hasOwn(action, 'participants')
}

// ---------- Types ----------

export type RestActionAuthor = z.infer<typeof RestActionAuthorSchema>
export type RestActionAddress = z.infer<typeof RestActionAddressSchema>
export type RestActionParticipant = z.infer<typeof RestActionParticipantSchema>
export type RestAction = z.infer<typeof RestActionSchema>
export type RestActionFull = z.infer<typeof RestActionFullSchema>
export type RestGetActionRequest = z.infer<typeof RestGetActionRequestSchema>
export type RestGetActionResponse = z.infer<typeof RestGetActionResponseSchema>
export type RestPostActionRequest = z.infer<typeof RestPostActionRequestSchema>
export type RestPostActionResponse = z.infer<typeof RestPostActionResponseSchema>
export type RestPutActionRequest = z.infer<typeof RestPutActionRequestSchema>
export type RestPutActionResponse = z.infer<typeof RestPutActionResponseSchema>
export type RestPutActionCancelRequest = z.infer<typeof RestPutActionCancelRequestSchema>
export type RestActionType = z.infer<typeof ActionTypeSchema>
export type RestActionStatus = z.infer<typeof ActionStatusSchema>

/** @deprecated Use RestPostActionRequest */
export type ActionCreateType = RestPostActionRequest
/** @deprecated Use RestActionFullSchema */
export const ActionFullSchema = RestActionFullSchema
/** @deprecated Use RestPostActionRequestSchema */
export const ActionCreateSchema = RestPostActionRequestSchema
