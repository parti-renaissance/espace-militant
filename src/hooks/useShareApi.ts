import { useCallback } from 'react'
import { Platform, Share } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system/legacy'
import { UnavailabilityError } from 'expo-modules-core'
import * as Sharing from 'expo-sharing'

export type ShareFile = { base64: string; mimeType: string; fileName?: string }
export type ShareContent = { url?: string; title?: string; message?: string; file?: ShareFile }

const DEFAULT_FILE_NAME = 'partage'

function toRawBase64(base64: string): string {
  if (base64.startsWith('data:')) {
    const commaIndex = base64.indexOf(',')
    if (commaIndex !== -1) return base64.slice(commaIndex + 1)
  }
  return base64
}

async function buildWebFile(file: ShareFile): Promise<File | null> {
  if (typeof File === 'undefined') return null
  try {
    const response = await fetch(`data:${file.mimeType};base64,${toRawBase64(file.base64)}`)
    const blob = await response.blob()
    return new File([blob], file.fileName ?? DEFAULT_FILE_NAME, { type: file.mimeType })
  } catch {
    return null
  }
}

async function shareFileOnNative(file: ShareFile, content?: { url?: string; message?: string }): Promise<void> {
  const fileName = file.fileName ?? DEFAULT_FILE_NAME
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`
  await FileSystem.writeAsStringAsync(fileUri, toRawBase64(file.base64), { encoding: FileSystem.EncodingType.Base64 })

  if (content?.url || content?.message) {
    const message = [content.message, content.url].filter(Boolean).join('\n\n')
    const { default: RNShare } = await import('react-native-share')
    await RNShare.open({ url: fileUri, message, type: file.mimeType })
    return
  }

  await Sharing.shareAsync(fileUri, { mimeType: file.mimeType, UTI: file.mimeType })
}

export default function useShareApi() {
  const { data } = useQuery({
    queryKey: ['shareApi'],
    queryFn: () => {
      return Sharing.isAvailableAsync()
    },
  })

  const shareAsync = useCallback(async (payload: ShareContent) => {
    const { file, ...content } = payload

    if (typeof window !== 'undefined' && navigator.share) {
      const shareData: ShareData = { title: content.title, text: content.message, url: content.url }
      if (file) {
        const webFile = await buildWebFile(file)
        if (webFile) {
          const withFile: ShareData = { ...shareData, files: [webFile] }
          if (!navigator.canShare || navigator.canShare(withFile)) {
            shareData.files = [webFile]
          }
        }
      }
      return navigator.share(shareData).catch(() => {})
    }

    if (file && Platform.OS !== 'web') {
      return shareFileOnNative(file, content).catch((e) => {
        if (e instanceof UnavailabilityError) {
          throw e
        }
      })
    }

    if (!content.url && !content.message) return
    const rnContent = content.url
      ? { url: content.url, title: content.title, message: content.message }
      : { message: content.message ?? '', title: content.title }
    await Share.share(rnContent).catch((e) => {
      if (e instanceof UnavailabilityError) {
        throw e
      }
    })
  }, [])

  return {
    isShareAvailable: data,
    shareAsync,
  }
}
