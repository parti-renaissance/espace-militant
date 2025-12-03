import React, { Fragment, useEffect } from 'react'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import ProgressBar from '@/screens/shared/ProgressBar'
import { useUploadFile } from '@/services/files/hook'
import { useForm } from 'react-hook-form'
import { Spinner, YStack } from 'tamagui'
import { useImageSelector } from './useImageSelector'

type NodeEditorProps = {
  value: S.ImageNode
  onChange: (node: S.ImageNode) => void
  onBlur: () => void
  present: boolean
}

export const ImageNodeEditor = (props: NodeEditorProps) => {
  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      ...props.value,
      content: props.value.content,
    },
  })

  const onSubmit = handleSubmit((data) => {
    props.onChange(data)
    props.onBlur()
  })

  const handleOnChange = (x: NonNullable<S.ImageNode['content']>) => {
    setValue('content', x)
    onSubmit()
  }

  return props.present ? <ImageLibraryStateTrigger onChange={handleOnChange} onBlur={props.onBlur} /> : <Fragment />
}

const ImageLibraryStateTrigger = (props: { onChange: (x: S.ImageNode['content']) => void; onBlur: () => void }) => {
  const { mutateAsync } = useImageSelector()
  const { mutateAsync: uploadFile, progress, isPending } = useUploadFile()

  useEffect(() => {
    mutateAsync()
      .then((payload) => {
        if (payload) {
          return uploadFile({ uri: payload.url, filename: payload.filename ?? 'image.png', dataType: 'image/png' }).then((x) => {
            props.onChange({ ...payload, url: x.url })
          })
        }
      })
      .finally(props.onBlur)
  }, [])

  return (
    <YStack position="absolute" gap="$medium" justifyContent="center" alignItems="center" right={0} left={0} bottom={0} top={0}>
      <Spinner />
      <YStack position="absolute" gap="$medium" right={0} left={0} bottom={0} justifyContent="flex-end">
        {isPending ? <ProgressBar progress={progress} color="$blue5" /> : null}
      </YStack>
    </YStack>
  )
}
