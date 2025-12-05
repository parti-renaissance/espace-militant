import z from 'zod'
import { createRestPaginationSchema } from '../common/schema'

export const RessourceSchema = z.object({
  uuid: z.string().uuid(),
  label: z.string(),
  url: z.string().url(),
  image_url: z.string().url(),
})

export const RestGetRessourcesResponseSchema = createRestPaginationSchema(RessourceSchema)
export type RestGetRessourcesResponse = z.infer<typeof RestGetRessourcesResponseSchema>

export const RestGetRessourcesRequestSchema = z.object({
  page: z.number().optional(),
})
export type RestGetRessourcesRequest = z.infer<typeof RestGetRessourcesRequestSchema>
