import { z } from 'zod'

import { ActionType } from '@/services/actions/schema'

export const actionFormSchema = z.object({
  type: z.nativeEnum(ActionType),
  date: z.date().min(new Date(), 'La date ne peut pas être dans le passé.'),
  post_address: z
    .object({
      address: z.string(),
      postal_code: z.string(),
      city_name: z.string(),
      country: z.string(),
    })
    .superRefine(({ address, postal_code, city_name, country }, ctx) => {
      if (!address.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Sélectionnez une adresse précise (numéro et nom de rue).',
        })
        return
      }
      if (!city_name.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La ville est obligatoire.' })
        return
      }
      if (!country.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le pays est obligatoire.' })
        return
      }
      if (country === 'FR' && !postal_code.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le code postal est obligatoire pour la France' })
      }
    }),
  description: z.string().max(1000).optional(),
  send_invitation_email: z.boolean().optional(),
})

export type ActionFormSchemaValues = z.infer<typeof actionFormSchema>
