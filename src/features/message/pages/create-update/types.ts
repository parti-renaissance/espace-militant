import * as S from '@/features/message/schemas/messageBuilderSchema'

export type RenderFieldRef = {
  getFields: () => S.FieldsArray
  addField: (fromField: S.FieldsArray[number] | null, newFieldType: S.NodeType) => void
  removeField: (field: S.FieldsArray[number]) => void
  moveField: (field: S.FieldsArray[number], toRelative: number) => void
  scrollToField: (field: S.FieldsArray[number]) => void
}
