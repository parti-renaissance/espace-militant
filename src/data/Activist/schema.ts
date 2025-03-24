import { UserTagEnum } from '@/core/entities/UserProfile'
import { z } from 'zod'

export const ActivistTagTypesSchema = z.nativeEnum(UserTagEnum)
export type ActivistTagTypes = z.infer<typeof ActivistTagTypesSchema>

export const activistTagSchema = z.object({
  label: z.string(),
  type: ActivistTagTypesSchema.or(z.string()),
  code: z.string(),
})

export type ActivistTag = z.infer<typeof activistTagSchema>
