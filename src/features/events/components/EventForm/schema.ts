import { EventVisibilitySchema } from '@/services/events/schema'
import { isAfter } from 'date-fns'
import { z } from 'zod'

const partialUrlSchema = z.string().refine((value) => !value || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(value), {
  message: 'Le lien doit être valide',
})
const parsePartialUrl = (url: unknown) => {
  return partialUrlSchema.safeParse(url)
}

const requiredString = (start: string, min: number = 1) => {
  const message = `${start} est obligatoire.`
  return (
    z
      .string()
      .min(min, min === 1 ? message : `${start} doit contenir au moins ${min} caractères.`)
      // trick to make zod parse all the way to the end
      .optional()
      .transform((x) => x ?? '')
  )
}

const requiredStringAddress = (start: string) => {
  const message = `La localisation saisie ne contient pas ${start}. Saisissez un lieu plus précis.`
  return z
    .string({
      required_error: message,
    })
    .min(1, message)
}

const postAddressSchemaNullish = z.object({
  address: z.string().nullish(),
  postal_code: z.string().nullish(),
  city_name: z.string().nullish(),
  country: z.string().nullish(),
})

const postAddressSchema = z.object({
  address: requiredStringAddress('d’adresse'),
  postal_code: z.string().nullish(),
  city_name: requiredStringAddress('la ville'),
  country: requiredStringAddress('le pays'),
})

export const createEventSchema = z
  .object({
    scope: requiredString('Le champ de la portée'),
    image: z
      .object({
        url: z.string().nullable(),
        width: z.number().nullable(),
        height: z.number().nullable(),
      })
      .nullish(),
    name: requiredString('Le titre', 5),
    category: z
      .string()
      .min(1, `La catégorie est obligatoire.`)
      // trick to make zod parse all the way to the end
      .optional()
      .transform((x) => x ?? ''),

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
    post_address: postAddressSchemaNullish.optional(),
    time_zone: z.string(),
    electoral: z.boolean().optional(),
    visibility: EventVisibilitySchema,
    live_url: z
      .string()
      .nullish()
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
  .superRefine((data, ctx) => {
    if (isAfter(new Date(), data.begin_at)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "L'évenement doit être dans le futur",
        path: ['begin_at'],
      })
    }

    if (isAfter(data.begin_at, data.finish_at)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'La date de fin doit être postérieure à la date de début.',
        path: ['finish_at'],
      })
    }

    if (data.mode === 'meeting') {
      let errorMessage: string | null = null
      if (!data.post_address) {
        errorMessage = 'L’adresse est obligatoire pour un événement en présentiel'
      } else {
        const parseAddress = postAddressSchema.safeParse(data.post_address)
        if (parseAddress.success) {
          errorMessage = null
        } else {
          errorMessage = parseAddress.error.issues[0].message
        }
      }
      // Global error
      if (errorMessage !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errorMessage,
          path: ['post_address'],
        })
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
