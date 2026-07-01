import { z } from 'zod'

export type RestPostPushTokenRequest = z.infer<typeof RestPostPushTokenRequestSchema>
export const RestPostPushTokenRequestSchema = z.object({
  identifier: z.string(),
  source: z.string(),
})

export type RestPostPushTokenResponse = z.infer<typeof RestPostPushTokenResponseSchema>
export const RestPostPushTokenResponseSchema = z.any()
