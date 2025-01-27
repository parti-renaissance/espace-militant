import { EventVisibilitySchema } from '@/services/events/schema'
import { isBefore } from 'date-fns'
import { z } from 'zod'

const requiredString = (start: string) => z.string().min(1, `${start} est obligatoire.`)

const addressEntryTranslation = {
  address: 'L’adresse est manquante ou incorrecte.',
  postalCode: 'Le code postal est manquant ou incorrect.',
  cityName: 'La ville est manquante ou incorrecte.',
  country: 'Le pays est manquant ou incorrect.',
}

const postAddressSchema = z.object({
  address: z.string().nullish(),
  postal_code: z.string().nullish(),
  city_name: z.string().nullable().nullish(),
  country: z.string().nullable().nullish(),
})

export const createEventSchema = z
  .object({
    scope: requiredString('Le champ de la portée'),
    name: requiredString('Le titre'),
    category: requiredString('La catégorie'),
    description: requiredString('La description'),
    begin_at: z.date({
      required_error: 'La date de début est obligatoire.',
    }),
    finish_at: z.date({
      required_error: 'La date de fin est obligatoire.',
    }),
    capacity: z.number().optional(),
    mode: z.enum(['online', 'meeting']),
    visio_url: z.string().url().optional(),
    post_address: postAddressSchema.optional(),
    time_zone: z.string(),
    electoral: z.boolean().optional(),
    visibility: EventVisibilitySchema,
    live_url: z.string().url().optional(),
  })
  .refine((data) => isBefore(new Date(), data.begin_at), {
    message: "L'évenement doit être dans le futur",
    path: ['begin_at'],
  })
  .refine((data) => isBefore(data.begin_at, data.finish_at), {
    message: 'La date de fin doit être postérieure à la date de début.',
    path: ['finish_at'],
  })
  .refine((data) => data.mode === 'online' && data.visio_url, {
    message: 'Le lien de la visioconférence est obligatoire pour un événement virtuel',
    path: ['visio_url'],
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'meeting') {
      const checkHasAddressFull = data.post_address?.address && data.post_address?.postal_code && data.post_address?.city_name && data.post_address?.country

      // Global error
      if (!checkHasAddressFull) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'L’adresse est obligatoire pour un événement physique',
          path: ['post_address'],
        })
      }

      if (data.post_address) {
        for (const [k, v] of Object.entries(data.post_address)) {
          if (!v) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: addressEntryTranslation[k],
              path: ['post_address'],
            })
          }
        }
      }
    }
  })

export type EventFormData = z.infer<typeof createEventSchema>
