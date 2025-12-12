import React from 'react'
import { RichTextContent } from '@/components/VoxRichText'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { Controller, useForm } from 'react-hook-form'
import EditorModal from './EditorModal'

type NodeEditorProps = { 
  value: S.RichTextNode
  onChange: (node: S.RichTextNode) => void
  onBlur: () => void
  present: boolean 
}

export const RichTextNodeEditor = (props: NodeEditorProps) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...props.value,
      content: props.value.content ?? {
        pure: '',
        html: '',
        json: '',
      },
    },
  })

  const onSubmit = handleSubmit((data) => {
    props.onChange(data.content.pure.length === 0 ? { ...data, content: null } : data)
    props.onBlur()
  })

  const handleOnChange = (x: RichTextContent) => {
    setValue('content', x)
    onSubmit()
  }

  return (
    <Controller
      control={control}
      name="content"
      render={({ field }) => {
        return (
          <EditorModal 
            value={field.value} 
            onChange={handleOnChange} 
            onBlur={field.onBlur} 
            present={props.present} 
            onClose={props.onBlur} 
          />
        )
      }}
    />
  )
}
