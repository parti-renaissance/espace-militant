import { uniqueId } from 'lodash'
import * as S from './schema'

type NodeCreator<I extends S.Node> = () => I

const createTitle: NodeCreator<S.TitleNode> = () => {
  return {
    type: 'title',
    text: '',
  }
}

const createImage: NodeCreator<S.ImageNode> = () => {
  return {
    type: 'image',
    image: null,
  }
}

const createRichText: NodeCreator<S.RichTextNode> = () => {
  return {
    type: 'doc',
    content: [],
  }
}

const createButton: NodeCreator<S.ButtonNode> = () => {
  return {
    type: 'button',
    link: '',
    label: '',
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
    case 'title':
      return createTitle()
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
