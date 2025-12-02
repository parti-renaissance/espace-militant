import React, { useRef } from 'react'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { Save } from '@tamagui/lucide-icons'
import { useMutation } from '@tanstack/react-query'
import { XStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import { VoxRichTextEditor } from './VoxRichTextEditor'
import { RichTextContent, EditorRef } from './types'
import { normalizeHtmlLinks, normalizeJsonLinks } from '@/utils/normalizeUrl'
import ModalOrPageBase from './ViewportModal'

type VoxRichTextModalEditorProps = {
  open: boolean
  value: RichTextContent
  onChange: (value: RichTextContent) => void
  onClose: () => void
  title?: string
  placeholder?: string
}

export const VoxRichTextModalEditor: React.FC<VoxRichTextModalEditorProps> = ({ 
  open, 
  value, 
  onChange, 
  onClose,
  title = 'Éditeur',
  placeholder
}) => {
  const editorRef = useRef<EditorRef | null>(null)

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => editorRef.current!.getData(),
  })

  const handleOnChange = useDebouncedCallback(() => {
    mutateAsync().then((data) => {
      onChange({
        html: normalizeHtmlLinks(data.html),
        pure: data.pure,
        json: JSON.stringify(normalizeJsonLinks(data.json)),
      })
      onClose()
    })
  }, 200)

  return (
    <ModalOrPageBase
      open={open}
      onClose={onClose}
      header={
        <VoxHeader>
          <XStack alignItems="center" flex={1} width="100%">
            <XStack flexGrow={1}>
              <VoxHeader.Title>{title}</VoxHeader.Title>
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
      {open ? <VoxRichTextEditor ref={editorRef} value={value} placeholder={placeholder} /> : null}
    </ModalOrPageBase>
  )
}

