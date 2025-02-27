import * as S from '@/features/message/schemas/messageBuilderSchema'

export type RenderFieldRef = {
  getFields: () => S.FieldsArray
  addField: (newField: S.FieldsArray[number], afterField?: S.FieldsArray[number]) => void
  removeField: (field: S.FieldsArray[number]) => void
  moveField: (field: S.FieldsArray[number], toRelative: number) => void
  scrollToField: (field: S.FieldsArray[number]) => void
}

export type EditorMethods = Omit<RenderFieldRef, 'addField' | 'removeField'> & {
  addField: (node: S.Node | S.NodeType, afterField?: S.FieldsArray[number]) => void
  removeField: (field: S.FieldsArray[number]) => void
  unSelect: () => void
}
