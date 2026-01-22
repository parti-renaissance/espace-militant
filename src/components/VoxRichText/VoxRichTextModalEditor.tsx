import React, { useRef, useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import { Save } from '@tamagui/lucide-icons'
import { isWeb, XStack } from 'tamagui'
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
  maxWidth?: number
  enableVariables?: boolean
}

export const VoxRichTextModalEditor: React.FC<VoxRichTextModalEditorProps> = ({ 
  open, 
  value, 
  onChange, 
  onClose,
  title = 'Éditeur',
  placeholder,
  maxWidth,
  enableVariables,
}) => {
  const editorRef = useRef<EditorRef | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (editorRef.current?.focus && open) {
      editorRef.current.focus()
    }
  }, [open])

  const handleSave = async () => {
    if (!editorRef.current) {
      console.error('Editor ref is not available')
      return
    }
    
    setIsSaving(true)
    try {
      const data = await editorRef.current.getData()
      onChange({
        html: normalizeHtmlLinks(data.html),
        pure: data.pure,
        json: JSON.stringify(normalizeJsonLinks(data.json)),
      })
      onClose()
    } catch (error) {
      console.error('Error saving editor content:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ModalOrPageBase
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
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
                onPress={handleSave}
                loading={isSaving}
                disabled={isSaving}
              >
                Terminé
              </VoxButton>
            </XStack>
          </XStack>
        </VoxHeader>
      }
    >
      <VoxRichTextEditor 
        ref={editorRef} 
        value={value} 
        placeholder={placeholder}
        enableVariables={enableVariables}
      />
    </ModalOrPageBase>
  )
}

