import { z } from 'zod'

import { ActionType } from '@/services/actions/schema'

const requiredString = (start: string) => z.string().min(1, `${start} est obligatoire.`)

export const actionFormSchema = z.object({
  type: z.nativeEnum(ActionType),
  date: z.date().min(new Date(), 'La date ne peut pas être dans le passé.'),
  post_address: z
    .object({
      address: requiredString('L’adresse'),
      postal_code: z.string(),
      city_name: requiredString('La ville'),
      country: requiredString('Le pays'),
    })
    .superRefine(({ postal_code, country }, ctx) => {
      if (country === 'FR' && !postal_code) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postal_code'],
          message: 'Le code postal est obligatoire pour la France',
        })
      }
    }),
  description: z.string().max(1000).optional(),
})

export type ActionFormSchemaValues = z.infer<typeof actionFormSchema>
