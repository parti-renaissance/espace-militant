import { removePushToken } from '@/features/push-notification/api'
import { useMutation } from '@tanstack/react-query'

export function useRemovePushToken() {
  return useMutation({
    mutationFn: removePushToken,
  })
}
