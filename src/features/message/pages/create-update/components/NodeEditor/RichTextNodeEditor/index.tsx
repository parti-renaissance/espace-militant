import { useRef } from 'react'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { EditorRef, MyEditor } from '@/features/events/pages/create-edit/DescriptionInput'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Save } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { isWeb, XStack } from 'tamagui'
import ViewportModal from './ViewportModal'

type NodeEditorProps = { value: S.RichTextNode; onChange: (node: S.RichTextNode) => void; onBlur: () => void; present: boolean }

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
    props.onChange(data)
    props.onBlur()
  })

  const editorRef = useRef<EditorRef | null>(null)

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => editorRef.current!.getData(),
  })

  const handleOnChange = () => {
    mutateAsync().then((x) => {
      setValue('content', {
        ...x,
        json: JSON.stringify(x.json),
      })
      onSubmit()
    })
  }

  const showEditor = !isWeb ? props.present : true

  return (
    <Controller
      control={control}
      name="content"
      render={({ field }) => {
        return (
          <ViewportModal
            onClose={props.onBlur}
            open={props.present}
            header={
              <VoxHeader height={56} backgroundColor="white">
                <XStack alignItems="center" flex={1} width="100%">
                  <XStack flexGrow={1}>
                    <VoxHeader.Title>{field.value.pure.length > 0 ? 'Modifier le text' : 'Nouveau text'}</VoxHeader.Title>
                  </XStack>
                  <XStack flex={1} justifyContent="flex-end">
                    <VoxButton
                      size="sm"
                      iconLeft={Save}
                      theme="blue"
                      alignSelf="flex-end"
                      variant="text"
                      onPress={handleOnChange}
                      loading={isPending}
                      disabled={isPending}
                    >
                      Terminé
                    </VoxButton>
                  </XStack>
                </XStack>
              </VoxHeader>
            }
          >
            {showEditor ? <MyEditor ref={editorRef} label="Text" onChange={field.onChange} onBlur={field.onBlur} value={field.value} /> : null}
          </ViewportModal>
        )
      }}
    />
  )
}
