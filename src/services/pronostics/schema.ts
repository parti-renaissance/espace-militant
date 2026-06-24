import { z } from 'zod'

export const RestCreatePronosticParticipationRequestSchema = z.object({
  team_1_score: z.number().int().min(0).max(10),
  team_2_score: z.number().int().min(0).max(10),
})

export type RestCreatePronosticParticipationRequest = z.infer<typeof RestCreatePronosticParticipationRequestSchema>
