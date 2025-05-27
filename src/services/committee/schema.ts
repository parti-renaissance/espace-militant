import z from 'zod'

export const AnimatorSchema = z.object({
  uuid: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  id: z.string(),
  role: z.string().nullable(),
  image_url: z.string().url().nullable(),
})

export type RestGetComitteesResponse = z.infer<typeof RestGetComitteesResponseSchema>
export const RestGetComitteesResponseSchema = z.array(
  z.object({
    members_count: z.number(),
    description: z.string(),
    uuid: z.string().uuid(),
    name: z.string(),
    animator: AnimatorSchema,
  }),
)

export type RestGetComitteesRequest = z.infer<typeof RestGetComitteesRequestSchema>
export const RestGetComitteesRequestSchema = z.void()

export const RestSetMyCommitteeRequestSchema = z.void()
export type RestSetMyCommitteeRequest = z.infer<typeof RestSetMyCommitteeRequestSchema>

export type RestSetMyCommitteeResponse = z.infer<typeof RestSetMyCommitteeResponseSchema>
export const RestSetMyCommitteeResponseSchema = z.any()
