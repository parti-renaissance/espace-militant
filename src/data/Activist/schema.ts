import { z } from 'zod'

export const ActivistTagTypesSchema = z.union([z.literal('sympathisant'), z.literal('adherent'), z.literal('elu'), z.literal('other')])
export type ActivistTagTypes = z.infer<typeof ActivistTagTypesSchema>

export const activistTagSchema = z.object({
  label: z.string(),
  type: ActivistTagTypesSchema.or(z.string()),
  code: z.string(),
})

export type ActivistTag = z.infer<typeof activistTagSchema>
