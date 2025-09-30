import { z } from 'zod'

// Schema pour les choix de questions
export const FieldSurveyChoiceSchema = z.object({
  id: z.number(),
  content: z.string(),
})

// Schema pour les types de questions
export const FieldSurveyQuestionTypeSchema = z.enum(['simple_field', 'unique_choice', 'multiple_choice'])

// Schema pour les questions
export const FieldSurveyQuestionSchema = z.object({
  id: z.number(),
  type: FieldSurveyQuestionTypeSchema,
  content: z.string(),
  choices: z.array(FieldSurveyChoiceSchema),
})

// Schema pour les types de sondages
export const FieldSurveyTypeSchema = z.enum(['local', 'national'])

// Schema pour un sondage complet
export const FieldSurveySchema = z.object({
  uuid: z.string(),
  id: z.number(),
  type: FieldSurveyTypeSchema,
  questions: z.array(FieldSurveyQuestionSchema),
  name: z.string(),
  city: z.string().optional(),
})

// Schema pour les réponses de choix (legacy)
export const FieldSurveyAnswerChoiceLegacySchema = z.object({
  surveyQuestion: z.number(),
  selectedChoices: z.array(z.string()),
})

// Schema pour les réponses textuelles
export const FieldSurveyAnswerTextSchema = z.object({
  surveyQuestion: z.number(),
  textField: z.string(),
})

// Union des types de réponses
export const FieldSurveyAnswerLegacySchema = z.union([
  FieldSurveyAnswerChoiceLegacySchema,
  FieldSurveyAnswerTextSchema,
])

// Schema pour la requête d'envoi de réponses
export const FieldSurveyResultRequestSchema = z.object({
  survey: z.number(),
  type: z.string(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  emailAddress: z.string().email().optional(),
  agreedToStayInContact: z.boolean(),
  agreedToTreatPersonalData: z.boolean(),
  postalCode: z.string().optional(),
  profession: z.string().optional(),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  answers: z.array(FieldSurveyAnswerLegacySchema),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

// Types TypeScript exportés
export type FieldSurveyChoice = z.infer<typeof FieldSurveyChoiceSchema>
export type FieldSurveyQuestionType = z.infer<typeof FieldSurveyQuestionTypeSchema>
export type FieldSurveyQuestion = z.infer<typeof FieldSurveyQuestionSchema>
export type FieldSurveyType = z.infer<typeof FieldSurveyTypeSchema>
export type FieldSurvey = z.infer<typeof FieldSurveySchema>
export type FieldSurveyAnswerChoiceLegacy = z.infer<typeof FieldSurveyAnswerChoiceLegacySchema>
export type FieldSurveyAnswerText = z.infer<typeof FieldSurveyAnswerTextSchema>
export type FieldSurveyAnswerLegacy = z.infer<typeof FieldSurveyAnswerLegacySchema>
export type FieldSurveyResultRequest = z.infer<typeof FieldSurveyResultRequestSchema>
