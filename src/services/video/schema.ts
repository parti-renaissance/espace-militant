import { z } from 'zod'

export const RestVideoSchema = z.object({
  title: z.string(),
  duration: z.number(),
  width: z.number(),
  height: z.number(),
  uuid: z.string(),
  hls_url: z.string().url(),
  preview_url: z.string().url(),
  thumbnail_url: z.string().url(),
})

export const RestGetVideoResponseSchema = RestVideoSchema

// ----------------- Types -----------------

export type RestVideo = z.infer<typeof RestVideoSchema>
export type RestGetVideoResponse = z.infer<typeof RestGetVideoResponseSchema>
