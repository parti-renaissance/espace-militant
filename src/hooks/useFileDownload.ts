import { Platform } from 'react-native'
import clientEnv from '@/config/clientEnv'
import { useUserStore } from '@/store/user-store'
import { api } from '@/utils/api'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { getFullVersion } from '@/utils/version'
import { useToastController } from '@tamagui/toast'
import { useMutation } from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import { isWeb } from 'tamagui'
import * as z from 'zod'

type UseFileDownloadProps = {
  url: string
  fileName: string
  publicDownload?: boolean
}
export function useFileDownload() {
  const toast = useToastController()
  const { user } = useUserStore()
  const isAbsoluteUrl = (x: string) => x.startsWith('https://')
  const { mutateAsync: getFile, isPending } = useMutation({
    mutationFn: isWeb
      ? ({ url, publicDownload }: UseFileDownloadProps) =>
          api({
            method: 'GET',
            path: url,
            requestSchema: z.void(),
            responseSchema: z.any(),
            type: publicDownload ? 'public' : 'private',
            axiosConfig: {
              responseType: 'blob',
            },
          })()
      : ({ url, fileName, publicDownload }: UseFileDownloadProps) => {
          return FileSystem.downloadAsync(isAbsoluteUrl(url) ? url : `${clientEnv.API_BASE_URL}${url}`, FileSystem.documentDirectory + fileName, {
            headers: publicDownload
              ? undefined
              : {
                  Authorization: `Bearer ${user?.accessToken}`,
                  ['X-App-version']: getFullVersion(),
                },
          })
        },
  })
  const handleDownload = async (args: UseFileDownloadProps) => {
    try {
      if (isWeb) {
        const file: Blob = await getFile(args)
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = args.fileName
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const { uri }: FileSystem.FileSystemDownloadResult = await getFile(args)
        if (Platform.OS === 'android') {
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

          if (permissions.granted) {
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })

            await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, args.fileName, 'application/pdf').then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 })
            })
          } else {
            await shareAsync(uri, {
              mimeType: 'application/pdf',
              dialogTitle: `Reçu fiscal ${args.fileName}`,
              UTI: 'com.adobe.pdf',
            })
          }
        } else {
          await shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Reçu fiscal ${args.fileName}`,
            UTI: 'com.adobe.pdf',
          })
        }
      }
    } catch (error) {
      toast.show('Erreur', { message: 'Une erreur est survenue lors du téléchargement du fichier', type: 'error' })
      ErrorMonitor.log('Error while downloading tax receipt', error)
    }
  }

  return { handleDownload, isPending }
}
