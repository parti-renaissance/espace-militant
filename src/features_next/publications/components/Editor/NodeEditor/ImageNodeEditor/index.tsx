import { memo, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { getTokenValue, Spinner, useMedia, XStack, YStack } from 'tamagui'
import { AlertTriangle, CloudUpload, Image as ImageIcon, Save } from '@tamagui/lucide-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import VoxCard from '@/components/VoxCard/VoxCard'
import ViewportModal from '@/components/VoxRichText/ViewportModal'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

import ProgressBar from '@/screens/shared/ProgressBar'
import { useUploadFile } from '@/services/files/hook'

import { useImageSelector } from './useImageSelector'

type ImportImageCardProps = {
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  imageUrl?: string
  localImageUri?: string
  imageWidth?: number
  imageHeight?: number
  error?: string
  hasImage: boolean
  onImport: () => void
  disabled: boolean
}

const ImportImageCard = memo((props: ImportImageCardProps) => {
  if (props.isLoading) {
    return (
      <YStack
        backgroundColor="$textSurface"
        borderWidth={1}
        borderColor="$textOutline32"
        borderStyle="dashed"
        borderRadius="$medium"
        padding="$medium"
        gap="$medium"
        alignItems="center"
        justifyContent="center"
        height={258}
      >
        <Spinner />
        {props.isUploading && <ProgressBar progress={props.uploadProgress} color="$blue5" />}
        <YStack alignItems="center" gap="$xsmall">
          <Text.SM semibold textAlign="center">
            {!props.isUploading ? "Chargement de l'image..." : 'Importation en cours...'}
          </Text.SM>
        </YStack>
      </YStack>
    )
  }

  if (props.error) {
    return (
      <>
        <YStack backgroundColor="$textSurface" borderRadius="$medium" padding="$medium" gap="$medium" alignItems="center" justifyContent="center" height={258}>
          <AlertTriangle size={40} color="$orange6" />
          <YStack alignItems="center" gap="$xsmall">
            <Text.SM semibold textAlign="center" color="$orange6">
              {props.error}
            </Text.SM>
          </YStack>
        </YStack>
        <YStack alignItems="center">
          <YStack>
            <VoxButton iconLeft={CloudUpload} variant="outlined" theme="gray" onPress={props.onImport} disabled={props.disabled}>
              Réessayer
            </VoxButton>
          </YStack>
        </YStack>
      </>
    )
  }

  if ((props.hasImage && props.imageUrl) || (props.isUploading && props.localImageUri)) {
    const previewUrl = props.imageUrl || props.localImageUri
    return (
      <>
        <YStack
          backgroundColor="$textSurface"
          borderWidth={1}
          borderColor="$textOutline32"
          borderStyle="dashed"
          borderRadius="$medium"
          gap="$medium"
          alignItems="center"
          justifyContent="center"
          height={258}
          overflow="hidden"
          position="relative"
        >
          <YStack width="100%" height="100%" alignItems="center" justifyContent="center">
            {previewUrl && <Image source={previewUrl} contentFit="contain" style={{ width: '100%', height: '100%' }} />}
          </YStack>
          {props.isUploading && (
            <YStack position="absolute" bottom={0} left={0} right={0} padding="$medium">
              <ProgressBar progress={props.uploadProgress} color="$blue5" />
            </YStack>
          )}
        </YStack>
        {!props.isUploading && (
          <YStack alignItems="center">
            <YStack>
              <VoxButton iconLeft={CloudUpload} variant="outlined" theme="gray" onPress={props.onImport} disabled={props.disabled}>
                Remplacer cette image
              </VoxButton>
            </YStack>
            ﬂ
          </YStack>
        )}
      </>
    )
  }

  return (
    <YStack
      backgroundColor="$textSurface"
      borderWidth={1}
      borderColor="$textOutline32"
      borderStyle="dashed"
      borderRadius="$medium"
      padding="$medium"
      gap="$medium"
      alignItems="center"
      justifyContent="center"
      height={258}
    >
      <CloudUpload size={40} color="$gray4" />
      <YStack alignItems="center" gap="$small">
        <VoxButton variant="outlined" theme="gray" onPress={props.onImport} disabled={props.disabled}>
          Importer une image
        </VoxButton>
      </YStack>
    </YStack>
  )
})

type NodeEditorProps = {
  value: S.ImageNode
  onChange: (node: S.ImageNode) => void
  onBlur: () => void
  present: boolean
}

export const ImageNodeEditor = (props: NodeEditorProps) => {
  return <ImageNodeEditorContent {...props} />
}

const ImageNodeEditorContent = (props: NodeEditorProps) => {
  const insets = useSafeAreaInsets()
  const media = useMedia()
  const isIosMobile = media.sm && Platform.OS === 'ios'

  const imageSelector = useImageSelector()
  const { mutateAsync: uploadFile, progress, isPending } = useUploadFile()
  const [uploadError, setUploadError] = useState<string | undefined>(undefined)

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...props.value,
      content: props.value.content ?? {
        url: '',
        width: 0,
        height: 0,
        link_url: '',
      },
    },
    resolver: zodResolver(S.ImageNodeValidationSchema),
  })

  useEffect(() => {
    if (!imageSelector.data) {
      return
    }

    const payload = imageSelector.data

    if (!payload) {
      return
    }

    setUploadError(undefined)
    uploadFile({ uri: payload.url, filename: payload.filename ?? 'image.png', dataType: 'image/png' })
      .then((x) => {
        setValue('content.url', x.url)
        setValue('content.width', payload.width)
        setValue('content.height', payload.height)
      })
      .catch((error) => {
        console.error('Upload error:', error)
        setValue('content.url', '')
        setValue('content.width', 0)
        setValue('content.height', 0)
        setUploadError("Une erreur est survenue lors de l'importation de l'image. Veuillez réessayer.")
      })
  }, [imageSelector.data, uploadFile, setValue])

  const onSubmit = useDebouncedCallback(() => {
    const values = control._formValues
    const hasContent = values.content?.url?.length > 0 && values.content?.width > 0 && values.content?.height > 0

    if (hasContent) {
      handleSubmit((data) => {
        props.onChange(data)
        props.onBlur()
      })()
    } else {
      props.onBlur()
    }
  }, 100)

  const handleImportImage = () => {
    setUploadError(undefined)
    imageSelector.mutate()
  }

  const isLoading = isPending || imageSelector.isPending

  return (
    <ViewportModal
      maxWidth={480}
      height="auto"
      onClose={() => props.onBlur()}
      open={props.present}
      header={
        <VoxHeader safeAreaView={Platform.OS === 'android' ? false : true}>
          <XStack alignItems="center" flex={1} width="100%">
            <XStack flexGrow={1}>
              <VoxHeader.Title icon={ImageIcon}>Image</VoxHeader.Title>
            </XStack>
            <XStack flex={1} justifyContent="flex-end">
              <VoxButton size="sm" iconLeft={Save} theme="blue" alignSelf="flex-end" variant="text" onPress={onSubmit} disabled={isLoading}>
                Terminé
              </VoxButton>
            </XStack>
          </XStack>
        </VoxHeader>
      }
    >
      <XStack bg="$textSurface" padding="$medium">
        <Text.SM semibold>Importez une image. Vous pouvez y ajouter un lien pour la rendre cliquable.</Text.SM>
      </XStack>
      <VoxCard.Content paddingBottom={insets.bottom + getTokenValue('$medium')}>
        <YStack gap="$medium">
          <ImportImageCard
            isLoading={isLoading}
            isUploading={isPending}
            uploadProgress={progress}
            imageUrl={control._formValues.content?.url}
            localImageUri={imageSelector.data?.url}
            imageWidth={control._formValues.content?.width}
            imageHeight={control._formValues.content?.height}
            error={uploadError}
            hasImage={!!control._formValues.content?.url}
            onImport={handleImportImage}
            disabled={isLoading}
          />

          <Controller
            control={control}
            name="content.link_url"
            render={({ field, fieldState }) => {
              return (
                <Input
                  bottomSheetInput={isIosMobile}
                  label="Lien (optionnel)"
                  color="gray"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  inputMode="url"
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
