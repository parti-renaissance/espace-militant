import { z } from 'zod'

export const RestPronosticScoreSchema = z.object({
  team_1_score: z.number(),
  team_2_score: z.number(),
})

export const pronosticStatusSchema = z.enum(['scheduled', 'not_participated', 'participated', 'closed', 'result_available'])

export const RestPronosticAlertDataSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  match_at: z.string(),
  team_1: z.string(),
  team_2: z.string(),
  gabriel_pronostic: RestPronosticScoreSchema,
  status: pronosticStatusSchema,
  participation: RestPronosticScoreSchema.nullish(),
  result: RestPronosticScoreSchema.nullish(),
  won: z.boolean().nullish(),
})

export const RestPostPronosticParticipationRequestSchema = z.object({
  team_1_score: z.number().int().min(0).max(10),
  team_2_score: z.number().int().min(0).max(10),
})

export const RestGetPronosticResponseSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  begin_at: z.string(),
  match_at: z.string(),
  team_1: z.string(),
  team_2: z.string(),
  gabriel_pronostic: RestPronosticScoreSchema,
  status: pronosticStatusSchema,
  participation: RestPronosticScoreSchema.nullable(),
  result: RestPronosticScoreSchema.nullish(),
  won: z.boolean().nullish(),
  image_url: z.string().nullable(),
})

export type RestPronosticScore = z.infer<typeof RestPronosticScoreSchema>
export type PronosticStatus = z.infer<typeof pronosticStatusSchema>
export type RestPronosticAlertData = z.infer<typeof RestPronosticAlertDataSchema>
export type RestPostPronosticParticipationRequest = z.infer<typeof RestPostPronosticParticipationRequestSchema>
export type RestGetPronosticResponse = z.infer<typeof RestGetPronosticResponseSchema>
