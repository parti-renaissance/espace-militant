import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '@/components/base/Input/Input'
import Select from '@/components/base/Select/SelectV3'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import VoxCard from '@/components/VoxCard/VoxCard'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Save } from '@tamagui/lucide-icons'
import { Controller, useForm } from 'react-hook-form'
import { getTokenValue, useMedia, XStack, YStack } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import ViewportModal from './ViewportModal'

type NodeEditorProps = { value: S.ButtonNode; onChange: (node: S.ButtonNode) => void; onBlur: () => void; present: boolean }

export const ButtonNodeEditor = (props: NodeEditorProps) => {
  const insets = useSafeAreaInsets()
  const media = useMedia()
  const isIosMobile = media.sm && Platform.OS === 'ios'
  const { control, handleSubmit } = useForm({
    defaultValues: {
      ...props.value,
      content: props.value.content ?? {
        link: '',
        text: '',
      },
    },
    resolver: zodResolver(S.ButtonNodeValidationSchema),
  })

  const onSubmit = useDebouncedCallback(
    handleSubmit((data) => {
      props.onChange(data)
      props.onBlur()
    }),
    100,
  )

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
                    { value: 'primary', label: 'Primaire (bleu)' },
                    { value: 'secondary', label: 'Secondaire (blanc)' },
                  ]}
                  value={field.value?.filter((x) => x !== 'unsupported')[0]}
                  onChange={(x) => field.onChange([x])}
                  error={fieldState.error?.message}
                />
              )
            }}
          />
        </YStack>
      </VoxCard.Content>
    </ViewportModal>
  )
}
