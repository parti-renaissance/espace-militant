import { useMutation } from '@tanstack/react-query'
import * as DocumentPicker from 'expo-document-picker'

const openDocumentLibrary = () => {
  return DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  })
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 Mo

export type DocumentSelectorResult = {
  uri: string
  filename: string
  size: number
  dataType: string
  error?: string
}

export const useDocumentSelector = () => {
  return useMutation({
    mutationFn: () =>
      openDocumentLibrary().then((result) => {
        if (result.canceled) {
          return Promise.resolve(undefined)
        }
        
        const file = result.assets[0]
        const fileSize = file.size || 0
        
        if (fileSize > MAX_FILE_SIZE) {
          return {
            uri: '',
            filename: '',
            size: 0,
            dataType: '',
            error: 'Le fichier ne doit pas dépasser 100 Mo'
          }
        }
        
        return { 
          uri: file.uri, 
          filename: file.name, 
          size: fileSize, 
          dataType: file.mimeType || 'application/octet-stream' 
        }
      }),
  })
}

