import { Platform } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { ImageManipulator } from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { last } from 'lodash'

const openImageLibrary = () => {
  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: Platform.OS === 'android' ? 0.75 : 1,
  })
}

const compressImage = async (x: { uri: string; height: number; width: number }) => {
  const MAX_WIDTH = 600

  const ctx = ImageManipulator.manipulate(x.uri)
  if (x.width > MAX_WIDTH) {
    ctx.resize({ width: MAX_WIDTH })
  }
  const img = await ctx.renderAsync()
  return img.saveAsync({
    compress: 0.75,
  })
}
export const useImageSelector = () => {
  return useMutation({
    mutationFn: () =>
      openImageLibrary()
        .then(async (x) => {
          if (x.canceled) {
            return Promise.resolve(undefined)
          }
          const compressedImage = await compressImage({
            uri: x.assets[0].uri,
            width: x.assets[0].width,
            height: x.assets[0].height,
          })

          let filename = x.assets[0].fileName ?? 'unknown.png'
          const ext = last(filename?.split('.'))?.toLowerCase()
          if (ext && ext !== 'png') {
            filename = filename.replace(ext, 'png')
          }

          return { ...compressedImage, filename }
        })
        .then((x) => {
          return x ? { url: x.uri, height: x.height, width: x.width, filename: x.filename } : undefined
        }),
  })
}
