import { EventVisibilitySchema } from '@/services/events/schema'
import { isBefore } from 'date-fns'
import { z } from 'zod'

const partialUrlSchema = z.string().refine((value) => !value || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(value), {
  message: 'Le lien doit être valide',
})
const parsePartialUrl = (url: unknown) => {
  return partialUrlSchema.safeParse(url)
}

const requiredString = (start: string, min: number = 1) => {
  const message = `${start} est obligatoire.`
  return z
    .string({
      required_error: message,
    })
    .min(min, min === 1 ? message : `${start} doit contenir au moins ${min} caractères.`)
}

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
    description: requiredString('La description', 10),
    begin_at: z.date({
      required_error: 'La date de début est obligatoire.',
    }),
    finish_at: z.date({
      required_error: 'La date de fin est obligatoire.',
    }),
    capacity: z.number().optional(),
    mode: z.enum(['online', 'meeting']),
    visio_url: z
      .string()
      .optional()
      .transform((x) => {
        if (x) {
          if (z.string().url().safeParse(x).success) {
            return x
          }
          return `https://${x}`
        }
      }),
    post_address: postAddressSchema.optional(),
    time_zone: z.string(),
    electoral: z.boolean().optional(),
    visibility: EventVisibilitySchema,
    live_url: z
      .string()
      .optional()
      .refine((value) => !value || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(value), {
        message: 'Le lien doit être valide',
      })
      .transform((x) => {
        if (x) {
          if (z.string().url().safeParse(x).success) {
            return x
          }
          return `https://${x}`
        }
      }),
  })
  .refine((data) => isBefore(new Date(), data.begin_at), {
    message: "L'évenement doit être dans le futur",
    path: ['begin_at'],
  })
  .refine((data) => isBefore(data.begin_at, data.finish_at), {
    message: 'La date de fin doit être postérieure à la date de début.',
    path: ['finish_at'],
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'meeting') {
      const checkHasAddressFull = data.post_address?.address && data.post_address?.postal_code && data.post_address?.city_name && data.post_address?.country

      // Global error
      if (!checkHasAddressFull) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'L’adresse est obligatoire pour un événement en présentiel',
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
    } else {
      if (!data.visio_url || data.visio_url.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Le lien de la visioconférence est obligatoire pour un événement en ligne',
          path: ['visio_url'],
        })
      }

      if (parsePartialUrl(data.visio_url).error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Le lien de la visioconférence doit être un lien valide',
          path: ['visio_url'],
        })
      }
    }
  })

export type EventFormData = z.infer<typeof createEventSchema>
