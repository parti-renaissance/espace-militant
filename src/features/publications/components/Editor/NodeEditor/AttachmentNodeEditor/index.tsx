import { useEffect, useState, useRef, memo } from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '@/components/base/Input/Input'
import { VoxButton } from '@/components/Button'
import { VoxHeader } from '@/components/Header/Header'
import VoxCard from '@/components/VoxCard/VoxCard'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Upload, UploadCloud, FileCheck2, AlertTriangle, Paperclip } from '@tamagui/lucide-icons'
import { Controller, useForm } from 'react-hook-form'
import { getTokenValue, useMedia, XStack, YStack, Spinner } from 'tamagui'
import { useDebouncedCallback } from 'use-debounce'
import ViewportModal from '../ButtonNodeEditor/ViewportModal'
import Text from '@/components/base/Text'
import { useDocumentSelector } from './useDocumentSelector'
import { useUploadPublicationFile } from '@/services/files/hook'
import { useLocalSearchParams } from 'expo-router'
import ProgressBar from '@/screens/shared/ProgressBar'

const formatFileSize = (sizeInBytes: number | undefined): string => {
  if (!sizeInBytes) return '0 Ko'

  const sizeInKb = sizeInBytes / 1024
  const sizeInMb = sizeInKb / 1024

  if (sizeInMb >= 1) {
    return `${Math.round(sizeInMb)} Mo`
  }

  return `${Math.round(sizeInKb)} Ko`
}

type ImportFileCardProps = {
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  fileName?: string
  fileSize?: number
  error?: string
  hasFile: boolean
  onImport: () => void
  disabled: boolean
}

const ImportFileCard = memo((props: ImportFileCardProps) => {
  if (props.isLoading) {
    return (
      <YStack backgroundColor="$textSurface" borderWidth={1} borderColor="$textOutline32" borderStyle="dashed" borderRadius="$medium" padding="$medium" gap="$medium" alignItems="center" justifyContent="center" height={258}>
        <Spinner />
        {props.isUploading && <ProgressBar progress={props.uploadProgress} color="$blue5" />}
        <YStack alignItems="center" gap="$xsmall">
          <Text.SM semibold textAlign="center">
            {!props.isUploading ? 'Chargement du fichier...' : 'Importation en cours...'}
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
            <VoxButton
              iconLeft={Upload}
              variant="outlined"
              theme="gray"
              onPress={props.onImport}
              disabled={props.disabled}
            >
              Réessayer
            </VoxButton>
          </YStack>
        </YStack>
      </>
    )
  }

  if (props.hasFile) {
    return (
      <>
        <YStack backgroundColor="$textSurface" borderWidth={1} borderColor="$textOutline32" borderStyle="dashed" borderRadius="$medium" padding="$medium" gap="$medium" alignItems="center" justifyContent="center" height={258}>
          <FileCheck2 size={40} color="$green5" />
          <YStack alignItems="center" gap="$xsmall">
            <Text.SM semibold textAlign="center">{props.fileName}</Text.SM>
            <Text.SM semibold secondary textAlign="center">{formatFileSize(props.fileSize)}</Text.SM>
          </YStack>
        </YStack>
        <YStack alignItems="center">
          <YStack>
            <VoxButton
              iconLeft={Upload}
              variant="outlined"
              theme="gray"
              onPress={props.onImport}
              disabled={props.disabled}
            >
              Remplacer par un nouvel import
            </VoxButton>
          </YStack>
        </YStack>
      </>
    )
  }

  return (
    <YStack backgroundColor="$textSurface" borderWidth={1} borderColor="$textOutline32" borderStyle="dashed" borderRadius="$medium" padding="$medium" gap="$medium" alignItems="center" justifyContent="center" height={258}>
      <UploadCloud size={40} color="$gray4" />
      <YStack alignItems="center" gap="$xsmall">
        <VoxButton
          iconLeft={Upload}
          variant="outlined"
          theme="gray"
          onPress={props.onImport}
          disabled={props.disabled}
        >
          Importer un fichier
        </VoxButton>
        <Text.SM semibold secondary textAlign="center">Maximum 100 Mo</Text.SM>
      </YStack>
    </YStack>
  )
})

type NodeEditorProps = {
  value: S.AttachmentNode
  onChange: (node: S.AttachmentNode) => void
  onBlur: () => void
  present: boolean
}

export const AttachmentNodeEditor = (props: NodeEditorProps) => {

  if (!props.present) {
    return null
  }

  return <AttachmentNodeEditorContent {...props} />
}

const AttachmentNodeEditorContent = (props: NodeEditorProps) => {
  const insets = useSafeAreaInsets()
  const media = useMedia()
  const isIosMobile = media.sm && Platform.OS === 'ios'
  const searchParams = useLocalSearchParams<{ scope?: string }>()
  const scope = searchParams?.scope || ''

  const documentSelector = useDocumentSelector()
  const { mutateAsync: uploadFile, progress, isPending } = useUploadPublicationFile()
  const [uploadError, setUploadError] = useState<string | undefined>(undefined)
  const hasInitializedTitle = useRef(false)

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      ...props.value,
      content: props.value.content ?? {
        name: '',
        title: '',
        url: '',
        size: undefined,
      },
    },
    resolver: zodResolver(S.AttachmentNodeValidationSchema),
  })

  useEffect(() => {
    if (!documentSelector.data) {
      return
    }

    const payload = documentSelector.data

    if (payload.error) {
      setUploadError(payload.error)
      return
    }
    
    console.log('Starting file upload:', {
      filename: payload.filename,
      size: payload.size,
      dataType: payload.dataType,
      uri: payload.uri
    })
    
    setValue('content.name', payload.filename)

    const currentTitle = getValues('content.title')
    if (!hasInitializedTitle.current || !currentTitle) {
      setValue('content.title', payload.filename)
      hasInitializedTitle.current = true
    }

    setUploadError(undefined)
    uploadFile({ uri: payload.uri, filename: payload.filename, dataType: payload.dataType, scope })
      .then((x) => {
        setValue('content.url', x.url)
        setValue('content.size', payload.size)
      })
      .catch((error) => {
        console.error('Upload error:', error)
        setValue('content.url', '')
        setValue('content.size', undefined)
        setUploadError('Une erreur est survenue lors de l\'importation du fichier. Veuillez réessayer.')
      })
  }, [documentSelector.data, scope, uploadFile, setValue, getValues])

  const onSubmit = useDebouncedCallback(() => {
    const values = control._formValues
    const hasContent = values.content?.name?.length > 0 && values.content?.url?.length > 0

    if (hasContent) {
      handleSubmit((data) => {
        props.onChange(data)
        props.onBlur()
      })()
    } else {
      props.onBlur()
    }
  }, 100)

  const handleImportFile = () => {
    setUploadError(undefined)
    documentSelector.mutate()
  }

  const isLoading = isPending || documentSelector.isPending

  return (
    <ViewportModal
      onClose={() => props.onBlur()}
      open={props.present}
      header={
        <VoxHeader.NoSafeFrame height={56} backgroundColor="white">
          <XStack alignItems="center" flex={1} width="100%">
            <XStack flexGrow={1}>
              <VoxHeader.Title icon={Paperclip}>Pièce jointe</VoxHeader.Title>
            </XStack>
            <XStack flex={1} justifyContent="flex-end">
              <VoxButton
                size="sm"
                iconLeft={Save}
                theme="blue"
                alignSelf="flex-end"
                variant="text"
                onPress={onSubmit}
                disabled={isLoading}
              >
                Terminé
              </VoxButton>
            </XStack>
          </XStack>
        </VoxHeader.NoSafeFrame>
      }
    >
      <XStack bg="$textSurface" padding="$medium">
        <Text.SM semibold>
          Importez n'importe quel fichier jusqu'à 100 Mo. Votre fichier deviendra téléchargeable directement depuis la publication.
        </Text.SM>
      </XStack>
      <VoxCard.Content paddingBottom={insets.bottom + getTokenValue('$medium')}>
        <YStack gap="$medium">
          <Controller
            control={control}
            name="content.title"
            render={({ field, fieldState }) => {
              return (
                <Input
                  bottomSheetInput={isIosMobile}
                  selectTextOnFocus
                  label="Nom du fichier"
                  color="gray"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )
            }}
          />

          <ImportFileCard
            isLoading={isLoading}
            isUploading={isPending}
            uploadProgress={progress}
            fileName={control._formValues.content?.name}
            fileSize={control._formValues.content?.size}
            error={uploadError || documentSelector.data?.error}
            hasFile={!!control._formValues.content?.url}
            onImport={handleImportFile}
            disabled={isLoading}
          />
        </YStack>
      </VoxCard.Content>
    </ViewportModal>
  )
}

