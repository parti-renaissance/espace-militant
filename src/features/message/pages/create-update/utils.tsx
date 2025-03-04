import * as S from '@/features/message/schemas/messageBuilderSchema'
import { uniqueId } from 'lodash'

type NodeCreator<I extends S.Node> = () => I

const createImage: NodeCreator<S.ImageNode> = () => {
  return {
    type: 'image',
    marks: ['frame'],
    content: null,
  }
}

const createRichText: NodeCreator<S.RichTextNode> = () => {
  return {
    type: 'richtext',
    content: null,
  }
}

const createButton: NodeCreator<S.ButtonNode> = () => {
  return {
    type: 'button',
    content: null,
    marks: ['primary'],
  }
}

export const createNodeByType = (type: S.NodeType) => {
  switch (type) {
    case 'image':
      return createImage()
    case 'button':
      return createButton()
    case 'richtext':
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

export const zipMessage = (states: S.MessageFormValues, struct: S.FieldsArray, metaData: S.MessageMetaData): S.Message => {
  return struct.reduce<S.Message>(
    (acc, { id, type }) => {
      const node = states[type]?.[id]
      if (node) {
        acc.content.push(node)
      }
      return acc
    },
    { type: 'message', metaData, content: [] },
  )
}

export const unZipMessage = (x: S.Message) => {
  return x.content.reduce<{ states: S.MessageFormValues; struct: S.FieldsArray; metaData: S.MessageMetaData }>(
    (acc, next) => {
      const uuid = uniqueId()
      acc.states[next.type][uuid] = next
      acc.struct.push({ id: uuid, type: next.type })
      return acc
    },
    {
      states: getDefaultFormValues(),
      struct: [],
      metaData: x.metaData,
    },
  )
}
