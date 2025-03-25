import { errorMessages } from '@/utils/errorMessages'
import { getCountryCodeForRegionCode, parsePhoneNumber } from 'awesome-phonenumber'
import { isBefore, subYears } from 'date-fns'
import { z } from 'zod'

const buildReqError = (start: string) => ({
  required_error: `${start} est obligatoire.`,
})

const requiredString = (start: string) => z.string().min(1, `${start} est obligatoire.`)

const buildLinkError = (start: string) => `le lien ${start} n’est pas valide.`

export const validateBirthdateFormSchema = z.date().refine((birthdate) => isBefore(birthdate, subYears(new Date(), 15)), {
  message: "L'âge doit être d'au moins 15 ans.",
})

export const validateNationalityFormSchema = z.string({ message: 'La nationalité est obligatoire.' }).refine((nationality) => nationality.length === 2, {
  message: 'La nationalité doit être composée de 2 caractères.',
})

export const validateInformationsFormSchema = z.object({
  first_name: requiredString('Le prénom'),
  last_name: requiredString('Le nom'),
  gender: z.enum(['male', 'female', 'other'], buildReqError('Le genre')),
  nationality: validateNationalityFormSchema,
  birthdate: validateBirthdateFormSchema,
})

export const validateCoordFormSchema = z.object({
  phone: z
    .object({
      country: z
        .string(buildReqError('Le code pays'))
        .refine((x) => getCountryCodeForRegionCode(x) !== undefined, {
          message: 'Le code pays doit être de deux lettres',
        })
        .optional(),
      number: z.string().optional(),
    })
    .refine(
      ({ country, number }) => {
        if (!number) return true
        return parsePhoneNumber(number, { regionCode: country }).valid
      },
      {
        message: 'Numéro invalide',
      },
    )
    .nullable(),
  email_address: z.string().email(errorMessages.email),
})

export const validateLocationFormSchema = z.object({
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
})

export const validateRSFormSchema = z.object({
  facebook_page_url: z.string().url(buildLinkError('facebook')).optional().nullable(),
  twitter_page_url: z.string().url(buildLinkError('twitter')).optional().nullable(),
  linkedin_page_url: z.string().url(buildLinkError('linkedin')).optional().nullable(),
  instagram_page_url: z.string().url(buildLinkError('instagram')).optional().nullable(),
  telegram_page_url: z.string().url(buildLinkError('telegram')).optional().nullable(),
})

export const validateAccountFormSchema = z.object({
  first_name: requiredString('Le prénom'),
  last_name: requiredString('Le nom'),
  gender: z.enum(['male', 'female', 'other'], buildReqError('Le genre')),
  nationality: z.string().length(2, 'Le code pays doit être de deux lettres').optional(),
  birthdate: z.date().refine((birthdate) => isBefore(birthdate, subYears(new Date(), 15)), {
    message: "L'âge doit être d'au moins 15 ans.",
  }),
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
  email_address: z.string().email(errorMessages.email),
  facebook_page_url: z.string().url(buildLinkError('facebook')).optional().nullable(),
  twitter_page_url: z.string().url(buildLinkError('twitter')).optional().nullable(),
  linkedin_page_url: z.string().url(buildLinkError('linkedin')).optional().nullable(),
  instagram_page_url: z.string().url(buildLinkError('instagram')).optional().nullable(),
  telegram_page_url: z.string().url(buildLinkError('telegram')).optional().nullable(),
  phone: z
    .object({
      country: z.string(buildReqError('Le code pays')).refine((x) => getCountryCodeForRegionCode(x) !== undefined, {
        message: 'Le code pays doit être de deux lettres',
      }),
      number: requiredString('Le numéro de téléphone'),
    })
    .refine(
      ({ country, number }) => {
        return parsePhoneNumber(number, { regionCode: country }).valid
      },
      {
        message: 'Le numéro de téléphone n’est pas valide',
      },
    ),
})
