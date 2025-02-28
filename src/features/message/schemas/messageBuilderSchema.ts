import type { TextStyle, ViewStyle } from 'react-native'
import { tipTapDocumentSchema } from '@/components/TipTapRenderer/schema'
import z from 'zod'

export const ImageNodeSchema = z.object({
  type: z.literal('image'),
  marks: z.array(z.union([z.literal('borderless'), z.literal('frame')]).or(z.string().transform(() => 'unsupported' as const))).optional(),
  content: z
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
  marks: z.array(z.union([z.literal('primary'), z.literal('secondary')]).or(z.string().transform(() => 'unsupported' as const))).optional(),
  content: z
    .object({
      text: z.string(),
      link: z.string(),
    })
    .nullish(),
})
export type ButtonNode = z.infer<typeof ButtonNodeSchema>

export const NodeSchema = z.union([ImageNodeSchema, RichTextNodeSchema, ButtonNodeSchema])
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

export type GlobalForm = {
  selectedField: { edit: boolean; field: FieldsArray[number] } | null
  formValues: MessageFormValues
}

export type FieldsArray = { type: NodeType; id: string }[]
export const nodeTypesArray: NodeType[] = ['image', 'doc', 'button']

// Extrait les marks d'un type de node
export type ExtractMarks<T extends NodeType> = Extract<Node, { type: T }> extends { marks?: infer M } ? (M extends (infer U)[] ? U : never) : never

export type NodeStyle<T extends NodeType> = {
  global?: {
    container?: ViewStyle
    base?: T extends 'button' ? TextStyle : ViewStyle
  }
} & (ExtractMarks<T> extends string // si la node a des marks, on ajoute les styles pour chacun d'eux
  ? {
      [K in ExtractMarks<T>]?: {
        container?: ViewStyle
        base?: T extends 'button' ? TextStyle : ViewStyle
      }
    }
  : never)

export type MessageStyle = {
  global: ViewStyle
} & {
  [K in NodeType]?: NodeStyle<K>
}

export type HasMarks<T> = T extends { marks?: infer M } ? (M extends (infer U)[] ? U : never) : never
