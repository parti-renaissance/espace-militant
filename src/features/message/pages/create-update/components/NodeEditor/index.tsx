import { Fragment } from 'react'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Control, Controller } from 'react-hook-form'
import { ButtonNodeEditor } from './ButtonNodeEditor'
import { RichTextNodeEditor } from './RichTextNodeEditor'

type NodeEditorProps = {
  control: Control<S.GlobalForm>
}

export const NodeEditor = (props: NodeEditorProps) => {
  return (
    <Controller
      control={props.control}
      name="selectedField"
      render={({ field }) => {
        if (field.value?.field.type === 'button') {
          return (
            <Controller
              control={props.control}
              name={`formValues.${field.value.field.type}.${field.value.field.id}`}
              render={(form) => {
                return <ButtonNodeEditor onChange={form.field.onChange} value={form.field.value} />
              }}
            />
          )
        }

        if (field.value?.field.type === 'doc') {
          return (
            <Controller
              control={props.control}
              name={`formValues.${field.value.field.type}.${field.value.field.id}`}
              render={(form) => {
                return <RichTextNodeEditor onChange={form.field.onChange} value={form.field.value} />
              }}
            />
          )
        }
        return <Fragment />
      }}
    />
  )
}
