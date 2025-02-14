import React, { useRef } from 'react'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { EditorRef, MyEditor, Payloads } from '@/features/events/pages/create-edit/DescriptionInput'
import { Save, Text as TextIcon } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { isWeb, XStack } from 'tamagui'
import ViewportModal from './ViewportModal'

type EditorModalProps = {
  value: Payloads
  onChange: (data: Payloads) => void
  onBlur: () => void
  present: boolean
  onClose: () => void
}

const EditorModal = ({ value, onChange, onBlur, present, onClose }: EditorModalProps) => {
  const editorRef = useRef<EditorRef | null>(null)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => editorRef.current!.getData(),
  })

  const handleSave = () => {
    mutateAsync().then((x) => {
      onChange({
        ...x,
        json: JSON.stringify(x.json),
      })
    })
  }

  const showEditor = !isWeb ? present : true

  return (
    <ViewportModal
      onClose={onClose}
      open={present}
      header={
        <VoxHeader height={56} backgroundColor="white">
          <XStack alignItems="center" flex={1} width="100%">
            <XStack flexGrow={1}>
              <VoxHeader.Title icon={TextIcon}>{value.pure.length > 0 ? 'Modifier le texte' : 'Nouveau texte'}</VoxHeader.Title>
            </XStack>
            <XStack flex={1} justifyContent="flex-end">
              <VoxButton
                size="sm"
                iconLeft={Save}
                theme="blue"
                alignSelf="flex-end"
                variant="text"
                onPress={handleSave}
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
      {showEditor ? <MyEditor placeholder="Votre contenu..." ref={editorRef} label="Texte" onChange={onChange} onBlur={onBlur} value={value} /> : null}
    </ViewportModal>
  )
}

export default EditorModal
