import { z } from 'zod'

export type RestAlertsResponse = z.infer<typeof RestAlertsResponseSchema>
export const RestAlertsResponseSchema = z.array(
  z.object({
    type: z.string().nullish(),
    label: z.string(),
    title: z.string(),
    description: z.string(),
    cta_label: z.string().nullable(),
    cta_url: z.string().nullable(),
    image_url: z.string().nullish(),
    share_url: z.string().nullish(),
  }),
)

export const RestAlertsRequestSchema = z.void()
