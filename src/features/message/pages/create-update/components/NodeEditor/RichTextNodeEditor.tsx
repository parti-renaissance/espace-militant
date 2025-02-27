import { useEffect, useRef } from 'react'
import { EditorRef, MyEditor2 } from '@/features/events/pages/create-edit/DescriptionInput'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Controller, useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

export const RichTextNodeEditor = (props: { value: S.RichTextNode; onChange: (node: S.RichTextNode) => void }) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      field: {
        pure: '',
        json: props.value,
      },
    },
  })

  const editorRef = useRef<EditorRef>(null)

  const onSubmit = useDebouncedCallback(
    handleSubmit((data) => {
      props.onChange(data.field.json)
    }),
    100,
  )

  const handleRichTextChange = useDebouncedCallback(async (fn: (x: { pure: string; json: object }) => void) => {
    if (editorRef.current) {
      const data = await editorRef.current.getData()
      fn(data)
    }
  }, 300)

  useEffect(() => {
    const subscriber = watch(() => {
      onSubmit()
    })

    return () => {
      subscriber.unsubscribe()
    }
  }, [])

  return (
    <>
      <Controller
        control={control}
        name="field"
        render={({ field }) => {
          return <MyEditor2 value={field.value} onChange={() => handleRichTextChange(field.onChange)} ref={editorRef} />
        }}
      />
    </>
  )
}
