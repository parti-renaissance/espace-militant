import type { IconComponent } from '@/models/common.model'
import { DoorOpen, Layers3, Mailbox, Paintbrush } from '@tamagui/lucide-icons'
import * as z from 'zod'
import { createRestPaginationSchema } from '../common/schema'

export type SelectPeriod = 'past' | 'today' | 'tomorow' | 'to-come'

export enum ActionType {
  PAP = 'pap',
  BOITAGE = 'boitage',
  TRACTAGE = 'tractage',
  COLLAGE = 'collage',
}

export enum FilterActionType {
  ALL = 'all',
  PAP = 'pap',
  BOITAGE = 'boitage',
  TRACTAGE = 'tractage',
  COLLAGE = 'collage',
}

export const ReadableActionType: Record<ActionType, string> = {
  [ActionType.PAP]: 'Porte à Porte',
  [ActionType.BOITAGE]: 'Boîtage',
  [ActionType.TRACTAGE]: 'Tractage',
  [ActionType.COLLAGE]: 'Collage',
}

export const ActionTypeIcon: Record<ActionType, IconComponent> = {
  [ActionType.PAP]: DoorOpen,
  [ActionType.BOITAGE]: Mailbox,
  [ActionType.TRACTAGE]: Layers3,
  [ActionType.COLLAGE]: Paintbrush,
}

export enum ActionStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

const ActionTypeSchema = z.nativeEnum(ActionType)
const ActionStatusSchema = z.nativeEnum(ActionStatus)
const ActionAuthor = z.object({
  uuid: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  image_url: z.string().url().nullish(),
  role: z.string().nullish(),
  instance: z.string().nullish(),
  zone: z.string().nullish(),
})

const ActionAddressSchema = z.object({
  address: z.string(),
  postal_code: z.string(),
  city: z.string().nullable(),
  city_name: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const ActionParticipantSchema = z.object({
  is_present: z.boolean(),
  adherent: ActionAuthor,
  uuid: z.string().uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

const ActionSchema = z.object({
  type: ActionTypeSchema,
  date: z.coerce.date(),
  status: ActionStatusSchema,
  uuid: z.string().uuid(),
  post_address: ActionAddressSchema,
  user_registered_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  author: ActionAuthor.nullish(),
  participants_count: z.number(),
  first_participants: z.array(ActionParticipantSchema),
})

export const ActionFullSchema = ActionSchema.omit({ first_participants: true, participants_count: true }).merge(
  z.object({
    description: z.string().nullable(),
    editable: z.boolean(),
    participants: z.array(ActionParticipantSchema),
  }),
)

export const ActionCreateSchema = z.object({
  type: ActionTypeSchema,
  date: z.string(),
  description: z.string(),
  post_address: z.object({
    address: z.string(),
    postal_code: z.string(),
    city_name: z.string(),
    country: z.string(),
  }),
})

export const propertyPathSchema = z.enum([
  'post_address',
  'post_address.address',
  'post_address.postal_code',
  'post_address.city_name',
  'post_address.country',
  'date',
  'description',
  'type',
])

export const ActionPaginationSchema = createRestPaginationSchema(ActionSchema)

export const ActionRequestSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  page: z.number(),
  subscribeOnly: z.boolean().optional(),
  type: z.nativeEnum(FilterActionType).optional(),
  period: z.string().optional(),
})

export const RestGetActionsRequestSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  subscribeOnly: z.boolean().optional(),
  'date[after]': z.string().optional(),
  'date[before]': z.string().optional(),
  type: z.nativeEnum(FilterActionType).optional(),
})

export type RestActionRequestParams = z.infer<typeof ActionRequestSchema>

export type RestActionType = z.infer<typeof ActionTypeSchema>
export type RestActionStatus = z.infer<typeof ActionStatusSchema>
export type RestActionAuthor = z.infer<typeof ActionAuthor>
export type RestActionAddress = z.infer<typeof ActionAddressSchema>
export type RestActionParticipant = z.infer<typeof ActionParticipantSchema>
export type RestAction = z.infer<typeof ActionSchema>
export type RestActions = z.infer<typeof ActionPaginationSchema>
export type ActionCreateType = z.infer<typeof ActionCreateSchema>
export type RestActionFull = z.infer<typeof ActionFullSchema>
export type Action = RestAction | RestActionFull

export const isFullAction = (action: Action): action is RestActionFull => {
  return Object.hasOwn(action, 'description') && Object.hasOwn(action, 'participants')
}

export const isPaginatedActionItems = (actions: Action): actions is RestAction => {
  return Object.hasOwn(actions, 'first_participants') && Object.hasOwn(actions, 'participants_count')
}
