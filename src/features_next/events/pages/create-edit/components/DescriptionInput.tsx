import React, { useState } from 'react'
import { SelectFrames as SF } from '@/components/base/Select/Frames'
import Text from '@/components/base/Text'
import { Pen } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import { VoxRichTextRenderer, VoxRichTextModalEditor } from '@/components/VoxRichText/index'
import { RichTextContent } from '@/components/VoxRichText/types'

type DescriptionInputProps = {
  value: RichTextContent
  onChange: (value: RichTextContent) => void
  onBlur: () => void
  label: string
  error?: string
  placeholder?: string
  modalTitle?: string
  height?: number
}

export default function DescriptionInput(props: DescriptionInputProps) {
  const { value, onChange, onBlur, label, error, placeholder = 'Décrivez votre contenu...', modalTitle = 'Éditeur', height = 214 } = props
  const [open, setOpen] = useState(false)

  const handleOnClose = () => {
    setOpen(false)
    onBlur()
  }

  return (
    <>
      <SF.Props>
        <SF error={Boolean(error)} onPress={() => setOpen(true)} height="auto">
          <YStack flex={1} height={height} gap="$medium" paddingVertical="$medium" overflow="hidden">
            <XStack gap="$small">
              <XStack flexShrink={1} flex={1} alignItems="center" gap="$small">
                <SF.Label>{label}</SF.Label>
              </XStack>
              <XStack>
                <SF.Icon icon={Pen} />
              </XStack>
            </XStack>
            <YStack flexGrow={1} onPress={(e) => e.bubbles} cursor="pointer" borderRadius="$space.small">
              <VoxRichTextRenderer key={value.json} value={value.json} primary placeholder={placeholder} />
            </YStack>
          </YStack>
          <YStack position="absolute" bottom={0} left={0} right={0} top={0} cursor="pointer" />
        </SF>
      </SF.Props>
      {error ? (
        <XStack paddingHorizontal="$medium" alignSelf="flex-start" pt="$xsmall">
          <Text.XSM textAlign="right" color="$orange5">
            {error}
          </Text.XSM>
        </XStack>
      ) : null}
      <VoxRichTextModalEditor 
        open={open} 
        value={value} 
        onChange={onChange} 
        onClose={handleOnClose}
        title={modalTitle}
        placeholder={placeholder}
      />
    </>
  )
}

