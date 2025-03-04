import { Platform } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'

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

export const useImageSelector = () => {
  return useMutation({
    mutationFn: () =>
      openImageLibrary()
        .then((x) => {
          if (x.canceled) {
            return Promise.resolve(undefined)
          }
          return compressImage({
            uri: x.assets[0].uri,
            width: x.assets[0].width,
            height: x.assets[0].height,
          })
        })
        .then((x) => {
          return x?.base64 ? { url: 'data:image/webp;base64,' + x.base64, height: x.height, width: x.width } : undefined
        }),
  })
}
