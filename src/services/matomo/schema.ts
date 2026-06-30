import { z } from 'zod'

export const RestMatomoUtmParamsSchema = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
})

export const RestMatomoCampaignParamsSchema = z.object({
  _rcs: z.string().optional(),
  _rcm: z.string().optional(),
  _rcn: z.string().optional(),
  _rcc: z.string().optional(),
  _rck: z.string().optional(),
})

export const createRestPostMatomoRequestSchema = <Request extends z.ZodRawShape>(payload: z.ZodObject<Request>) =>
  z
    .object({
      idsite: z.string(),
      rec: z.number(),
      apiv: z.number(),
      send_image: z.number(),
    })
    .merge(payload)

export const RestPostMatomoActionRequestSchema = z
  .object({
    action_name: z.string(),
    url: z.string().url().optional(),
  })
  .merge(RestMatomoCampaignParamsSchema)

export const RestPostMatomoEventRequestSchema = z
  .object({
    e_c: z.string(),
    e_a: z.string(),
    e_n: z.string().optional(),
    e_v: z.string().optional(),
  })
  .merge(RestMatomoCampaignParamsSchema)

export const RestPostMatomoResponseSchema = z.any()

// ----------------- Types -----------------

export type RestMatomoUtmParams = z.infer<typeof RestMatomoUtmParamsSchema>
export type RestMatomoCampaignParams = z.infer<typeof RestMatomoCampaignParamsSchema>
export type RestPostMatomoActionRequest = z.infer<typeof RestPostMatomoActionRequestSchema>
export type RestPostMatomoEventRequest = z.infer<typeof RestPostMatomoEventRequestSchema>
export type RestPostMatomoResponse = z.infer<typeof RestPostMatomoResponseSchema>
