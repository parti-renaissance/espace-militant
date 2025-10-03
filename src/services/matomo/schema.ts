import { z } from 'zod'

export const MatomoDefaultRequestSchema = <Request extends z.ZodRawShape>(payload: z.ZodObject<Request>) =>
  z
    .object({
      idsite: z.string(),
      rec: z.number(),
      apiv: z.number(),
      send_image: z.number(),
    })
    .merge(payload)

export type MatomoDefaultResponse = z.infer<typeof MatomoDefaultResponseSchema>
export const MatomoDefaultResponseSchema = z.any()

export const MatomoEventRequestSchema = z.object({
  e_c: z.string(),
  e_a: z.string(),
  e_n: z.string().optional(),
  e_v: z.string().optional(),
  _rcn: z.string().optional(),
})
