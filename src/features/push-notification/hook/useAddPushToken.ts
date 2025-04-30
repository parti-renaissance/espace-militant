import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { useMutation } from '@tanstack/react-query'
import { addPushToken } from '../api'
import { TokenCannotBeSubscribedError } from '../errors'

export function useAddPushToken() {
  return useMutation({
    mutationFn: async (variables: { token: string }) => {
      console.log('Query token with', variables)
      return addPushToken({
        identifier: variables.token,
        source: 'vox',
      })
    },
    onError: (error) => {
      if (error instanceof TokenCannotBeSubscribedError) {
        ErrorMonitor.log('Error when add push token', {
          message: error.message,
          stack: error.stack,
        })
      }
    },
  })
}
