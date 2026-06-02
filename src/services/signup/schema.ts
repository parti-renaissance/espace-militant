import { z } from 'zod'

import { errorMessages } from '@/utils/errorMessages'

const civilitySchema = z.enum(['madame', 'monsieur'])

const RestPostSignupRequestObjectSchema = z.object({
  email: z.string().email(),
  source: z.string().max(100),
  recaptcha: z.string(),
  cgu_accepted: z.literal(true),
  civility: civilitySchema.optional(),
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
  phone: z.string().optional(),
  address: z.string().max(150).optional(),
  postal_code: z.string().max(15).optional(),
  city_name: z.string().max(255).optional(),
  country: z.string().length(2).optional(),
  email_opt_in: z.boolean().optional(),
  sms_opt_in: z.boolean().optional(),
})

export const RestPostSignupRequestSchema = RestPostSignupRequestObjectSchema.superRefine((data, ctx) => {
  if (data.sms_opt_in && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Le numéro de téléphone est requis pour recevoir des SMS',
      path: ['phone'],
    })
  }
})

export const RestPostSignupResponseSchema = z.null()

export const RestPostSignupActivateRequestSchema = z.object({
  email: z.string().email(),
  code: z.string().length(3),
  code_challenge: z.string(), // PKCE challenge (S256).
  client_id: z.string(), // OAuth client
  redirect_uri: z.string(), // OAuth redirect
})

export const RestPostSignupActivateResponseSchema = z.object({
  code: z.string(), // OAuth authorization code
})

export const RestPostSignupResendCodeRequestSchema = z.object({
  email: z.string().email(),
})

export const RestPostSignupResendCodeResponseSchema = z.null()

/** Schéma UI inscription — dérivé du contrat API avec messages utilisateur. */
export const SignupInscriptionFormSchema = RestPostSignupRequestObjectSchema.pick({
  email: true,
  email_opt_in: true,
}).extend({
  first_name: z.string().min(1, errorMessages.emptyField).max(50),
  email: z.string().email(errorMessages.email),
  postal_code: z
    .string()
    .min(1, errorMessages.emptyField)
    .max(15)
    .regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  email_opt_in: z.boolean(),
})

// ----------------- Types -----------------

export type RestPostSignupRequest = z.infer<typeof RestPostSignupRequestSchema>
export type RestPostSignupResponse = z.infer<typeof RestPostSignupResponseSchema>
export type RestPostSignupActivateRequest = z.infer<typeof RestPostSignupActivateRequestSchema>
export type RestPostSignupActivateResponse = z.infer<typeof RestPostSignupActivateResponseSchema>
export type RestPostSignupResendCodeRequest = z.infer<typeof RestPostSignupResendCodeRequestSchema>
export type RestPostSignupResendCodeResponse = z.infer<typeof RestPostSignupResendCodeResponseSchema>
export type SignupInscriptionFormValues = z.infer<typeof SignupInscriptionFormSchema>
