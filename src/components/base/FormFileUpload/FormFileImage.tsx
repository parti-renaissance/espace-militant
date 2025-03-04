import { ComponentPropsWithRef, useState } from 'react'
import { Platform } from 'react-native'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { Image as ImageIcon, Replace, Trash } from '@tamagui/lucide-icons'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { Image, Spinner, XStack, YStack } from 'tamagui'
import { FormFrame } from '../FormFrames'
import { SelectFrames } from '../Select/Frames'

type ImageData = {
  url: string | null
  width: number | null
  height: number | null
}

type ImageDataNonNull = {
  url: string
  width: number | null
  height: number | null
}

const hasUrl = (x?: ImageData | null): x is ImageDataNonNull => {
  return Boolean(x && x.url)
}

type FormFileImageProps = {
  value?: ImageData | null
  onChange?: (x?: ImageData | null) => void
  onBlur?: () => void
  placeholder?: string
  emptyHeight?: ComponentPropsWithRef<typeof FormFrame>['height']
  height?: ComponentPropsWithRef<typeof FormFrame>['height']
}

const openImageLibrary = () => {
  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: Platform.OS === 'android' ? 0.75 : 1,
  })
}

const compressImage = (x: { uri: string; height: number; width: number }) => {
  const shouldResize = x.width > 1200
  const resizeOpt = shouldResize
    ? [
        {
          resize: {
            width: 1200,
          },
        } as const,
      ]
    : []

  return manipulateAsync(x.uri, resizeOpt, {
    compress: 0.75,
    format: SaveFormat.WEBP,
    base64: true,
  })
}

export const FormFileImage = ({ height = 326, emptyHeight, ...props }: FormFileImageProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectImage = () => {
    setIsLoading(true)
    openImageLibrary()
      .then((x) => {
        if (x.canceled) return undefined
        return compressImage({
          uri: x.assets[0].uri,
          width: x.assets[0].width,
          height: x.assets[0].height,
        })
      })
      .then((x) => {
        props.onChange?.(x?.base64 ? { url: 'data:image/webp;base64,' + x.base64, height: x.height, width: x.width } : undefined)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const handleDelete = () => {
    props.onChange?.(null)
  }

  if (isLoading) return <PendingFile height={emptyHeight ?? height} />

  return hasUrl(props.value) ? (
    <HasFile value={props.value} onReplace={handleSelectImage} onDelete={handleDelete} height={height} />
  ) : (
    <NoFile placeholder={props.placeholder} onPress={handleSelectImage} height={emptyHeight ?? height} />
  )
}

const HasFile = (props: { value: ImageDataNonNull; onReplace?: () => void; onDelete?: () => void; height?: FormFileImageProps['height'] }) => {
  return (
    <FormFrame height={props.height} padding="$medium">
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$medium">
        <Image
          overflow="hidden"
          borderRadius={8}
          flex={1}
          width="100%"
          height="100%"
          resizeMode="center"
          source={{
            uri: props.value.url,
            width: props.value.width ?? undefined,
            height: props.value.height ?? undefined,
          }}
        />

        <XStack gap="$small">
          <VoxButton theme="orange" variant="text" iconLeft={Trash} onPress={props.onDelete}>
            Supprimer
          </VoxButton>
          <VoxButton theme="blue" variant="text" iconLeft={Replace} onPress={props.onReplace}>
            Remplacer
          </VoxButton>
        </XStack>
      </YStack>
    </FormFrame>
  )
}

const PendingFile = (props: { height?: FormFileImageProps['height'] }) => {
  return (
    <FormFrame height={props.height} justifyContent="center" alignItems="center">
      <Spinner />
    </FormFrame>
  )
}

export const NoFile = (props: { placeholder?: string; onPress?: () => void; height?: FormFileImageProps['height'] }) => {
  return (
    <SelectFrames height={props.height} onPress={props.onPress}>
      <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$large">
        <XStack gap="$small">
          <ImageIcon size={16} color="$blue5" />
          <Text.MD color="$blue5">{props.placeholder ?? 'Choisir une image'}</Text.MD>
        </XStack>
      </YStack>
    </SelectFrames>
  )
}
