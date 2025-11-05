import { useState } from 'react'
import * as api from '@/services/files/api'
import { useMutation } from '@tanstack/react-query'

export const useUploadFile = () => {
  const [progress, setProgress] = useState(0)
  const mut = useMutation({
    mutationFn: (args: Parameters<typeof api.uploadFile>[0]) => api.uploadFile(args, setProgress),
  })
  return { ...mut, progress }
}

export const useUploadPublicationFile = () => {
  const [progress, setProgress] = useState(0)
  const mut = useMutation({
    mutationFn: (args: Parameters<typeof api.uploadPublicationFile>[0]) => api.uploadPublicationFile(args, setProgress),
  })
  return { ...mut, progress }
}
