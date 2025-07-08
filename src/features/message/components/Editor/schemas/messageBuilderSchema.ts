import type { TextStyle, ViewStyle } from 'react-native'
import z from 'zod'

export const nodeTypesArray = ['image', 'richtext', 'button'] as const satisfies NodeType[]

export const ImageNodeSchema = z.object({
  type: z.literal('image'),
  marks: z.array(z.string()).optional(),
  content: z
    .object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .nullish(),
})

export type ImageNode = z.infer<typeof ImageNodeSchema>

export const RichTextNodeSchema = z.object({
  type: z.literal('richtext'),
  marks: z.array(z.string()).optional(),
  content: z
    .object({
      pure: z.string(),
      json: z.string(),
      html: z.string(),
    })
    .nullish(),
})
export type RichTextNode = z.infer<typeof RichTextNodeSchema>

export const ButtonNodeSchema = z.object({
  type: z.literal('button'),
  marks: z.array(z.string()).optional(),
  content: z
    .object({
      text: z.string(),
      link: z.string(),
      color: z.string().optional(),
    })
    .nullish(),
})

export const ButtonNodeValidationSchema = z.object({
  type: z.literal('button'),
  marks: z.array(z.union([z.literal('primary'), z.literal('secondary')])).nonempty({
    message: 'Veuillez choisir le style de votre bouton',
  }),
  content: z.object({
    text: z
      .string({
        required_error: 'Veuillez saisir le texte du bouton',
      })
      .min(1, {
        message: 'Le texte du bouton doit être au moins 1 caractère',
      })
      .max(80, {
        message: 'Le texte du bouton doit faire moins de 80 caractères',
      }),
    link: z
      .string({
        required_error: 'Veuillez saisir le lien du bouton',
      })
      .refine(
        (value) => {
          if (!value.trim()) return false
          const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/
          return regex.test(value)
        },
        {
          message: 'Veuillez saisir un lien valide',
        },
      ),
    color: z.string().optional(),
  }),
})

export type ButtonNode = z.infer<typeof ButtonNodeSchema>

export const NodeSchema = z.union([ImageNodeSchema, RichTextNodeSchema, ButtonNodeSchema])

export type Node = z.infer<typeof NodeSchema>
export type NodeType = z.infer<typeof NodeSchema>['type']

export const MessageFormValuesValidatorSchema = z.object({
  metaData: z.object({
    scope: z.string({ required_error: 'le rôle est obligatoire' }),
    subject: z
      .string({
        required_error: "L'objet est obligatoire",
      })
      .min(5, {
        message: "L'objet doit faire minimum 5 charatères",
      })
      .max(255, {
        message: "L'objet doit faire maximum 255 charatères",
      }),
  }),
  formValues: z.record(
    z.enum(nodeTypesArray),
    z.record(
      z.string(),
      z.object({ type: z.string(), content: z.any(), marks: z.array(z.string()).optional() }).refine(
        (x) => {
          return x.content !== null && x.content !== undefined
        },
        { message: 'Veuillez remplir ce block ou le supprimer' },
      ),
    ),
  ),
  addBarOpenForFieldId: z.string().nullable().optional(),
})

export const MessageMetaDataSchema = z.object({
  subject: z.string(),
  scope: z.string(),
})

export type MessageMetaData = z.infer<typeof MessageMetaDataSchema>

export const MessageSchema = z.object({
  type: z.literal('message'),
  metaData: MessageMetaDataSchema,
  content: z.array(NodeSchema),
})
export type Message = z.infer<typeof MessageSchema>

export type MessageFormValues = {
  [K in NodeType]: Record<string, Extract<Node, { type: K }>>
}

export type GlobalForm = {
  selectedField: { edit: boolean; field: FieldsArray[number] } | null
  formValues: MessageFormValues
  metaData: MessageMetaData
  addBarOpenForFieldId?: string | null
}

export type FieldsArray = { type: NodeType; id: string }[]

// Extrait les marks d'un type de node
export type ExtractMarks<T extends NodeType> = Extract<Node, { type: T }> extends { marks?: infer M } ? (M extends (infer U)[] ? U : never) : never

export type NodeStyle<T extends NodeType> = {
  global?: {
    wrapper?: ViewStyle
    container?: ViewStyle
    base?: T extends 'button' ? TextStyle : ViewStyle
  }
} & (ExtractMarks<T> extends string // si la node a des marks, on ajoute les styles pour chacun d'eux
  ? {
      [K in ExtractMarks<T>]?: {
        wrapper?: ViewStyle
        container?: ViewStyle
        base?: T extends 'button' ? TextStyle : ViewStyle
      }
    }
  : never)

export type MessageStyle = {
  global: {
    wrapper?: ViewStyle
    container?: ViewStyle
    item?: {
      wrapper?: ViewStyle
      trailing?: ViewStyle
      leading?: ViewStyle
      middle?: ViewStyle
      alone?: ViewStyle
    }
  }
} & {
  [K in NodeType]?: NodeStyle<K>
}

export type HasMarks<T> = T extends { marks?: infer M } ? (M extends (infer U)[] ? U : never) : never
