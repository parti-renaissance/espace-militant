import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '@/components/base/Input/Input'
import Select from '@/components/base/Select/SelectV3'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import VoxCard from '@/components/VoxCard/VoxCard'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Save } from '@tamagui/lucide-icons'
import { Controller, useForm } from 'react-hook-form'
import { getTokenValue, useMedia, XStack, YStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import ViewportModal from './ViewportModal'
import { useRef } from 'react'

type NodeEditorProps = { 
  value: S.ButtonNode; 
  onChange: (node: S.ButtonNode) => void; 
  onBlur: () => void; 
  present: boolean;
  senderThemeColor?: string; // Ajout de cette prop
}

export const ButtonNodeEditor = (props: NodeEditorProps) => {
  const insets = useSafeAreaInsets()
  const media = useMedia()
  const isIosMobile = media.sm && Platform.OS === 'ios'
  const linkInputRef = useRef<any>(null)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      ...props.value,
      content: props.value.content ?? {
        link: '',
        text: '',
        color: props.senderThemeColor || '#4291E1',
      },
    },
    resolver: zodResolver(S.ButtonNodeValidationSchema),
  })

  const onSubmit = useDebouncedCallback(() => {
    const values = control._formValues
    const hasContent = values.content?.text?.length > 0 || values.content?.link?.length > 0
    
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
              <VoxHeader.Title icon={Link}>{props.value.content ? 'Modifier le bouton' : 'Nouveau bouton'}</VoxHeader.Title>
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
            name="content.text"
            render={({ field, fieldState }) => {
              return (
                <Input
                  bottomSheetInput={isIosMobile}
                  selectTextOnFocus
                  label="Label"
                  color="gray"
                  defaultValue={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  returnKeyType="next"
                  onSubmitEditing={() => linkInputRef.current?.focus()}
                />
              )
            }}
          />
        </YStack>
        <YStack>
          <Controller
            control={control}
            name="content.link"
            render={({ field, fieldState }) => {
              return (
                <Input
                  bottomSheetInput={isIosMobile}
                  label="Lien"
                  color="gray"
                  inputMode="url"
                  defaultValue={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  ref={linkInputRef as any}
                  autoCapitalize="none"
                />
              )
            }}
          />
        </YStack>
        <YStack>
          <Controller
            control={control}
            name="marks"
            render={({ field, fieldState }) => {
              return (
                <Select
                  label="Style"
                  options={[
                    { value: 'primary', label: 'Bouton principal' },
                    { value: 'secondary', label: 'Bouton secondaire' },
                  ]}
                  value={field.value?.filter((x) => x !== 'unsupported')[0]}
                  onChange={(x) => field.onChange([x])}
                  error={fieldState.error?.message}
                />
              )
            }}
          />
        </YStack>
        <YStack display="none">
          <Controller
            control={control}
            name="content.color"
            render={({ field, fieldState }) => {
              return (
                <Input
                  bottomSheetInput={isIosMobile}
                  label="Couleur personnalisée (optionnel)"
                  color="gray"
                  placeholder="#4291E1"
                  defaultValue={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
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
