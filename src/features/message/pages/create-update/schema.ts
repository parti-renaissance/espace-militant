import { tipTapDocumentSchema } from '@/components/TipTapRenderer/schema'
import z from 'zod'

export const TitleNodeSchema = z.object({
  type: z.literal('title'),
  text: z.string(),
})
export type TitleNode = z.infer<typeof TitleNodeSchema>

export const ImageNodeSchema = z.object({
  type: z.literal('image'),
  image: z
    .object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .nullish(),
})
export type ImageNode = z.infer<typeof ImageNodeSchema>

export const RichTextNodeSchema = tipTapDocumentSchema
export type RichTextNode = z.infer<typeof RichTextNodeSchema>

export const ButtonNodeSchema = z.object({
  type: z.literal('button'),
  label: z.string(),
  link: z.string(),
})
export type ButtonNode = z.infer<typeof ButtonNodeSchema>

export const NodeSchema = z.union([TitleNodeSchema, ImageNodeSchema, RichTextNodeSchema, ButtonNodeSchema])
export type Node = z.infer<typeof NodeSchema>
export type NodeType = z.infer<typeof NodeSchema>['type']

export const MessageSchema = z.object({
  type: z.literal('message'),
  content: z.array(NodeSchema),
})
export type Message = z.infer<typeof MessageSchema>

export type MessageFormValues = {
  [K in NodeType]: Record<string, Extract<Node, { type: K }>>
}

export type FieldsArray = { type: NodeType; id: string }[]
export const nodeTypesArray: NodeType[] = ['title', 'image', 'doc', 'button']
