import { Fragment } from 'react'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Control, Controller } from 'react-hook-form'
import { ButtonNodeEditor } from './ButtonNodeEditor'

type NodeEditorProps = {
  control: Control<S.GlobalForm>
}

export const NodeEditor = (props: NodeEditorProps) => {
  return (
    <Controller
      control={props.control}
      name="selectedField"
      render={({ field }) => {
        if (field.value?.type === 'button') {
          return (
            <Controller
              control={props.control}
              name={`formValues.${field.value.type}.${field.value.id}`}
              render={(form) => {
                return <ButtonNodeEditor onChange={form.field.onChange} value={form.field.value} />
              }}
            />
          )
        }
        return <Fragment />
      }}
    />
  )
}
