import { GeneralConventionOrganizerEnum } from '@/screens/generalConventions/types'
import z from 'zod'

const RestGeneralConventionSchema = z.object({
  uuid: z.string().uuid(),
  participant_quality: z.string(),
  members_count: z.number(),
  meeting_type: z.enum(['on_site', 'remote']),
  reported_at: z.coerce.date(),
  general_summary: z.string().nullable(),
  organizer: z.nativeEnum(GeneralConventionOrganizerEnum),
  department_zone: z
    .object({
      code: z.string(),
      name: z.string(),
      uuid: z.string().uuid(),
    })
    .nullable(),
  committee: z
    .object({
      uuid: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
    })
    .nullable(),
  district_zone: z
    .object({
      code: z.string(),
      name: z.string(),
      uuid: z.string().uuid(),
    })
    .nullable(),
})

export const RestGeneralConventionResponseSchema = RestGeneralConventionSchema.merge(
  z.object({
    party_definition_summary: z.string().nullable(),
    unique_party_summary: z.string().nullable(),
    progress_since2016: z.string().nullable(),
    party_objectives: z.string().nullable(),
    governance: z.string().nullable(),
    communication: z.string().nullable(),
    militant_training: z.string().nullable(),
    member_journey: z.string().nullable(),
    mobilization: z.string().nullable(),
    talent_detection: z.string().nullable(),
    election_preparation: z.string().nullable(),
    relationship_with_supporters: z.string().nullable(),
    work_with_partners: z.string().nullable(),
    additional_comments: z.string().nullable(),
  }),
)

export const RestGetGeneralConventionsResponseSchema = z.array(RestGeneralConventionSchema)

export type RestGeneralConventionResponse = z.infer<typeof RestGeneralConventionSchema>
export type RestGetGeneralConventionsResponse = z.infer<typeof RestGetGeneralConventionsResponseSchema>
export type RestGetGeneralConventionResponse = z.infer<typeof RestGeneralConventionResponseSchema>
