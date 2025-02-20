import { z } from 'zod'

export const markSchema = z.object({
  type: z.union([z.literal('bold'), z.literal('italic')]),
})

export type TipMark = z.infer<typeof markSchema>

export const textSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(markSchema).optional(),
})
export type TipText = z.infer<typeof textSchema>

export const hardBreakSchema = z.object({
  type: z.literal('hardBreak'),
})

export type TipHardBreak = z.infer<typeof hardBreakSchema>

export const nonSupportedSchema = z.object({
  type: z.string().transform(() => 'non_supported' as const),
})

export type TipNonSupported = z.infer<typeof nonSupportedSchema>

export const paragraphSchema = z.object({
  type: z.literal('paragraph'),
  content: z.array(textSchema.or(hardBreakSchema).or(nonSupportedSchema)).optional(),
})

export type TipParagraph = z.infer<typeof paragraphSchema>

export const listItemSchema = z.object({
  type: z.literal('listItem'),
  content: z.array(paragraphSchema),
})

export type TipListItem = z.infer<typeof listItemSchema>

export const orderedListSchema = z.object({
  type: z.literal('orderedList'),
  attrs: z.object({
    start: z.number(),
  }),
  content: z.array(listItemSchema),
})

export type TipOrderedList = z.infer<typeof orderedListSchema>

export const bulletListSchema = z.object({
  type: z.literal('bulletList'),
  content: z.array(listItemSchema),
})

export type TipBulletList = z.infer<typeof bulletListSchema>

const contentSchema = z.union([paragraphSchema, orderedListSchema, bulletListSchema, nonSupportedSchema])

export type TipContent = z.infer<typeof contentSchema>

export const tipTapDocumentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(contentSchema),
})

export type TipTapDocument = z.infer<typeof tipTapDocumentSchema>
