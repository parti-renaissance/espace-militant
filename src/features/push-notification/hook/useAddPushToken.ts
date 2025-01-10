import FB from '@/config/firebaseConfig'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { useMutation } from '@tanstack/react-query'
import { addPushToken } from '../api'
import { TokenCannotBeSubscribedError } from '../errors'

export function useAddPushToken() {
  return useMutation({
    mutationFn: () =>
      FB.messaging.getToken().then((identifier) =>
        addPushToken({
          identifier,
          source: 'vox',
        }),
      ),
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
