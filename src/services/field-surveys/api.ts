import { api } from '@/utils/api'
import { FieldSurveySchema, FieldSurveyResultRequestSchema } from './schema'
import { z } from 'zod'

export const fieldSurveysServiceKey = 'field-surveys'
const base = '/api/jecoute/survey'

export const FieldSurveysService = {
  // GET /api/jecoute/survey - Récupère la liste des sondages
  getSurveys: api({
    method: 'GET',
    path: base,
    requestSchema: z.void(),
    responseSchema: z.array(FieldSurveySchema),
  }),

  // POST /api/jecoute/survey/reply - Envoie les réponses d'un sondage
  submitSurveyAnswers: api({
    method: 'POST',
    path: `${base}/reply`,
    requestSchema: FieldSurveyResultRequestSchema,
    responseSchema: z.void(),
  }),
}
