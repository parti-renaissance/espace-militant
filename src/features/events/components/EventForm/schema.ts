import { EventVisibilitySchema } from '@/services/events/schema'
import { z } from 'zod'

const requiredString = (start: string) => z.string().min(1, `${start} est obligatoire.`)

const addressEntryTranslation = {
  address: 'L’adresse est manquante ou incorrecte.',
  postalCode: 'Le code postal est manquant ou incorrect.',
  cityName: 'La ville est manquante ou incorrecte.',
  country: 'Le pays est manquant ou incorrect.',
}

const postAddressSchema = z.object({
  address: z.string().nullable(),
  postal_code: z.string().nullable(),
  city_name: z.string().nullable(),
  country: z.string().nullable(),
})

export const createEventSchema = z
  .object({
    name: requiredString('Le titre'),
    category: requiredString('La catégorie'),
    description: requiredString('La description'),
    begin_at: z.date().min(new Date(), 'La date de début est obligatoire.'),
    finish_at: z.date().min(new Date(), 'La date de fin est obligatoire.'),
    capacity: z.number().optional(),
    mode: z.enum(['online', 'meeting']),
    visio_url: z.string().url().optional(),
    post_address: postAddressSchema.optional(),
    time_zone: z.string(),
    electoral: z.boolean().optional(),
    visibility: EventVisibilitySchema,
    live_url: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.finish_at > data.begin_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['finish_at'],
        message: 'La date de fin doit être postérieure à la date de début.',
      })
    }
    if (data.mode === 'online' && !data.visio_url) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le lien de la visioconférence est obligatoire pour un événement virtuel',
        path: ['visioUrl'],
      })
    }

    if (data.mode === 'meeting') {
      const checkHasAddressFull = data.post_address?.address && data.post_address?.postal_code && data.post_address?.city_name && data.post_address?.country

      // Global error
      if (!checkHasAddressFull) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'L’adresse est obligatoire pour un événement physique',
          path: ['address'],
        })
      }

      if (data.post_address) {
        for (const [k, v] of Object.entries(data.post_address)) {
          if (!v) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: addressEntryTranslation[k],
              path: ['address', k],
            })
          }
        }
      }
    }
  })

export type EventFormData = z.infer<typeof createEventSchema>
