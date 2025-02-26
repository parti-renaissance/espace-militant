import * as S from '@/features/message/schemas/messageBuilderSchema'
import { uniqueId } from 'lodash'
import headingImagePlaceholderNode from '../../data/headingImagePlaceholder'

type NodeCreator<I extends S.Node> = () => I

const createImage: NodeCreator<S.ImageNode> = () => {
  return headingImagePlaceholderNode as S.ImageNode
}

const createRichText: NodeCreator<S.RichTextNode> = () => {
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nouveau block text' }] }],
  }
}

const createButton: NodeCreator<S.ButtonNode> = () => {
  return {
    type: 'button',
    link: '',
    label: 'Nouveau bloc bouton',
    marks: ['primary'],
  }
}

export const createNodeByType = (type: S.NodeType) => {
  switch (type) {
    case 'image':
      return createImage()
    case 'button':
      return createButton()
    case 'doc':
      return createRichText()
  }
}

export const updateNode = <K extends S.NodeType>(type: K, payload: Omit<Extract<S.Node, { type: K }>, 'type'>) => {
  return { ...createNodeByType(type), ...payload } as Extract<S.Node, { type: K }>
}

export const getDefaultFormValues = () => {
  const acc = {} as S.MessageFormValues
  S.nodeTypesArray.forEach((x) => (acc[x] = {}))
  return acc
}

export const zipMessage = (states: S.MessageFormValues, struct: S.FieldsArray): S.Message => {
  return struct.reduce<S.Message>(
    (acc, { id, type }) => {
      const node = states[type]?.[id]
      if (node) {
        acc.content.push(node)
      }
      return acc
    },
    { type: 'message', content: [] },
  )
}

export const unZipMessage = (x: S.Message): { states: S.MessageFormValues; struct: S.FieldsArray } => {
  return x.content.reduce<{ states: S.MessageFormValues; struct: S.FieldsArray }>(
    (acc, next) => {
      const uuid = uniqueId()
      acc.states[next.type][uuid] = next
      acc.struct.push({ id: uuid, type: next.type })
      return acc
    },
    {
      states: getDefaultFormValues(),
      struct: [],
    },
  )
}
