import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '@/components/base/Input/Input'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import VoxCard from '@/components/VoxCard/VoxCard'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Paperclip, Save } from '@tamagui/lucide-icons'
import { Controller, useForm } from 'react-hook-form'
import { getTokenValue, useMedia, XStack, YStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import ViewportModal from '../ButtonNodeEditor/ViewportModal'
import { useRef } from 'react'

type NodeEditorProps = { 
  value: S.AttachmentNode
  onChange: (node: S.AttachmentNode) => void
  onBlur: () => void
  present: boolean
}

export const AttachmentNodeEditor = (props: NodeEditorProps) => {
  const insets = useSafeAreaInsets()
  const media = useMedia()
  const isIosMobile = media.sm && Platform.OS === 'ios'
  const urlInputRef = useRef<any>(null)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      ...props.value,
      content: props.value.content ?? {
        name: '',
        url: '',
        size: undefined,
      },
    },
    resolver: zodResolver(S.AttachmentNodeValidationSchema),
  })

  const onSubmit = useDebouncedCallback(() => {
    const values = control._formValues
    const hasContent = values.content?.name?.length > 0 || values.content?.url?.length > 0
    
    if (hasContent) {
      handleSubmit((data) => {
        props.onChange(data)
        props.onBlur()
      })()
    } else {
      props.onBlur()
    }
  }, 100)

  return (
    <ViewportModal
      onClose={() => props.onBlur()}
      open={props.present}
      header={
        <VoxHeader.NoSafeFrame height={56} backgroundColor="white">
          <XStack alignItems="center" flex={1} width="100%">
            <XStack flexGrow={1}>
              <VoxHeader.Title icon={Paperclip}>{props.value.content ? 'Modifier la pièce jointe' : 'Nouvelle pièce jointe'}</VoxHeader.Title>
            </XStack>
            <XStack flex={1} justifyContent="flex-end">
              <VoxButton size="sm" iconLeft={Save} theme="blue" alignSelf="flex-end" variant="text" onPress={onSubmit}>
                Terminé
              </VoxButton>
            </XStack>
          </XStack>
        </VoxHeader.NoSafeFrame>
      }
    >
      <VoxCard.Content paddingBottom={insets.bottom + getTokenValue('$medium')}>
        <YStack>
          <Controller
            control={control}
            name="content.name"
            render={({ field, fieldState }) => {
              return (
                <Input
                  bottomSheetInput={isIosMobile}
                  selectTextOnFocus
                  label="Nom du fichier"
                  color="gray"
                  defaultValue={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  returnKeyType="next"
                  onSubmitEditing={() => urlInputRef.current?.focus()}
                />
              )
            }}
          />
        </YStack>
        <YStack>
          <Controller
            control={control}
            name="content.url"
            render={({ field, fieldState }) => {
              return (
                <Input
                  bottomSheetInput={isIosMobile}
                  label="URL du fichier"
                  color="gray"
                  inputMode="url"
                  defaultValue={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  ref={urlInputRef as any}
                  autoCapitalize="none"
                />
              )
            }}
          />
        </YStack>
      </VoxCard.Content>
    </ViewportModal>
  )
}

