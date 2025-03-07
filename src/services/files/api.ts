import { Platform } from 'react-native'
import clientEnv from '@/config/clientEnv'
import { useUserStore } from '@/store/user-store'
import { api } from '@/utils/api'
import { getFullVersion } from '@/utils/version'
import { createUploadTask, FileSystemUploadType } from 'expo-file-system'
import { z } from 'zod'
import { parseError } from '../common/errors/utils'

const API_URL = `${clientEnv.API_BASE_URL}/api/v3/upload-file?scope=president_departmental_assembly`

export const uploadFile = async (
  props: { uri: string; filename: string; dataType?: string },
  progressCb?: (progress: number) => void,
): Promise<{ url: string }> => {
  if (Platform.OS !== 'web') {
    const accessToken = useUserStore.getState().user?.accessToken
    const uploadTask = createUploadTask(
      API_URL,
      props.uri,
      {
        httpMethod: 'POST',
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ['X-App-version']: getFullVersion(),
        },
      },
      ({ totalBytesSent, totalBytesExpectedToSend }) => {
        const progress = parseFloat((totalBytesSent / (totalBytesExpectedToSend || 1)).toFixed(2))
        progressCb && progressCb(progress)
      },
    )
    return uploadTask
      .uploadAsync()
      .then((x) => {
        if (x?.body) {
          const body = JSON.parse(x.body)
          if (body.url) {
            return { url: body.url }
          }
          throw body
        }
        throw new Error('upload failed')
      })
      .catch((error) => {
        return parseError(error, [])
      })
  }

  return api({
    method: 'post',
    path: API_URL,
    requestSchema: z.void(),
    responseSchema: z.object({
      url: z.string(),
    }),
    type: 'private',
    axiosConfig: {
      data: await convertBlobUrlToFormData(props),
      onUploadProgress: (progressEvent) => {
        const progress = parseFloat((progressEvent.loaded / (progressEvent.total || 1)).toFixed(2))
        progressCb && progressCb(progress)
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  })()
}

async function convertBlobUrlToFormData(props: { uri: string; filename: string; dataType?: string }): Promise<FormData> {
  try {
    // Fetch the Blob from the Blob URL
    const response = await fetch(props.uri)
    const blob = await response.blob()

    const file = new File([blob], props.filename, { type: props.dataType })

    // Create a new FormData object
    const formData = new FormData()

    // Append the Blob to the FormData object
    formData.append('file', file, props.filename) // Replace 'filename.ext' with the desired file name and extension

    return formData
  } catch (error) {
    console.error('Error converting Blob URL to FormData:', error)
    throw error
  }
}
