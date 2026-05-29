import { z } from 'zod'

const OpinionSchema = z.enum(['keep', 'break', 'repair'])

const AnswerSchema = z.object({
  idea_id: z.string(),
  opinion: OpinionSchema,
  correction: z.string().nullable(),
})

const VoteMessageSchema = z.object({
  type: z.literal('VOTE'),
  payload: AnswerSchema,
})

const SubmissionMessageSchema = z.object({
  type: z.literal('SUBMISSION'),
  payload: z.object({
    answers: z.array(AnswerSchema),
    result: z.object({ matched_person: z.string() }),
  }),
})

const ShareProfileMessageSchema = z.object({
  type: z.literal('SHARE_PROFILE'),
  payload: z.object({
    base64: z.string(),
    mimeType: z.string(),
  }),
})

const ShareMessageSchema = z.object({
  type: z.literal('share'),
  text: z.string().optional(),
  url: z.string().optional(),
  base64: z.string().optional(),
  mimeType: z.string().optional(),
  fileName: z.string().optional(),
})

export const ToiPresidentMessageSchema = z.discriminatedUnion('type', [
  VoteMessageSchema,
  SubmissionMessageSchema,
  ShareProfileMessageSchema,
  ShareMessageSchema,
])

export type ToiPresidentMessage = z.infer<typeof ToiPresidentMessageSchema>

export function parseToiPresidentMessage(raw: unknown): ToiPresidentMessage | null {
  let data: unknown = raw
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw)
    } catch {
      return null
    }
  }
  const result = ToiPresidentMessageSchema.safeParse(data)
  return result.success ? result.data : null
}

export function stripBase64Prefix(base64: string): string {
  if (base64.startsWith('data:')) {
    const commaIndex = base64.indexOf(',')
    if (commaIndex !== -1) {
      return base64.slice(commaIndex + 1)
    }
  }
  return base64
}
