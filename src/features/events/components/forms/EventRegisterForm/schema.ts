import { z } from 'zod'

export const PublicSubscribtionFormDataSchema = z.object({
  first_name: z.string({
    required_error: 'Le prénom ne doit pas être vide',
  }),
  last_name: z.string({
    required_error: 'Le nom ne doit pas être vide',
  }),
  email_address: z
    .string({
      required_error: "L'email ne doit pas être vide",
    })
    .email({ message: "L'email n'est pas valide" }),
  postal_code: z
    .string({
      required_error: 'Le code postal ne doit pas être vide',
    })
    .min(3, { message: 'Le code postal doit contenir au minimum 3 chiffres' })
    .max(10, { message: 'Le code postal doit contenir au maximum 10 chiffres' }),
  cgu_accepted: z.boolean().refine((value) => value, { message: 'Vous devez accepter les CGU' }),
  join_newsletter: z.boolean(),
})
