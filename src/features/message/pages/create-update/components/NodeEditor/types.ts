import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Control } from 'react-hook-form'

export type NodeEditorItemProps<T extends S.NodeType> = {
  control: Control<S.GlobalForm>
  field: S.FieldsArray[number] & { type: T }
}
