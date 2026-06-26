import { z } from 'zod'

export const RestPronosticScoreSchema = z.object({
  team_1_score: z.number(),
  team_2_score: z.number(),
})

export const pronosticStatusSchema = z.enum(['scheduled', 'not_participated', 'participated', 'closed', 'result_available'])

export const pronosticResultStatusSchema = z.enum(['won', 'lost', 'draw', 'pending'])

export const RestPronosticDataSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  begin_at: z.string().nullish(),
  match_at: z.string(),
  team_1: z.string(),
  team_2: z.string(),
  gabriel_pronostic: RestPronosticScoreSchema,
  status: pronosticStatusSchema,
  participation: RestPronosticScoreSchema.nullish(),
  result: RestPronosticScoreSchema.nullish(),
  result_status: pronosticResultStatusSchema.nullish(),
  won: z.boolean().nullish(),
  image_url: z.string().nullish(),
})

export const RestGetPronosticResponseSchema = RestPronosticDataSchema

export const RestPostPronosticParticipationRequestSchema = z.object({
  team_1_score: z.number().int().min(0).max(10),
  team_2_score: z.number().int().min(0).max(10),
})

export type RestPronosticScore = z.infer<typeof RestPronosticScoreSchema>
export type PronosticStatus = z.infer<typeof pronosticStatusSchema>
export type PronosticResultStatus = z.infer<typeof pronosticResultStatusSchema>
export type RestPronosticData = z.infer<typeof RestPronosticDataSchema>
export type RestGetPronosticResponse = z.infer<typeof RestGetPronosticResponseSchema>
export type RestPostPronosticParticipationRequest = z.infer<typeof RestPostPronosticParticipationRequestSchema>
