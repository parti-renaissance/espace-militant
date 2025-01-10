import { z } from 'zod'

export type Slugs = 'adhesion' | 'donation' | 'contribution' | 'cadre'

export type RestGetMagicLinkRequest = z.infer<typeof RestGetMagicLinkRequestSchema>
export const RestGetMagicLinkRequestSchema = z
  .object({
    duration: z.enum(['0', '-1']).optional(),
    state: z.string().optional(),
    scope: z.string().optional(),
  })
  .optional()
  .or(z.void())

export type RestGetMagicLinkResponse = z.infer<typeof RestGetMagicLinkResponseSchema>
export const RestGetMagicLinkResponseSchema = z.object({
  url: z.string(),
})
