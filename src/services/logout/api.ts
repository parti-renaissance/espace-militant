import { Linking, Platform } from 'react-native'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import clientEnv from '@/config/clientEnv'
import { END_SESSION_ENDPOINT } from '@/config/discoveryDocument'
import { REDIRECT_URI } from '@/hooks/useLogin'
import { logout } from '@/services/profile/api'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

export function useLogOut() {
  const queryClient = useQueryClient()
  const { removeCredentials, user } = useUserStore()

  return useMutation<WebBrowser.WebBrowserAuthSessionResult | void, Error>({
    mutationFn: async () => {
      return logout()
    },
    onSuccess: async () => {
      if (user?.isAdmin) {
        removeCredentials()
        queryClient.clear()
        await queryClient.invalidateQueries()
        window.location.href = `${clientEnv.ADMIN_URL}/app/adherent/list?_switch_user=_exit`
        return
      }

      if (Platform.OS === 'web') {
        removeCredentials()
        queryClient.clear()
        await queryClient.invalidateQueries()
        window.location.assign(`${END_SESSION_ENDPOINT}?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`)
        return
      }

      router.replace('/evenements')
      removeCredentials()
      queryClient.clear()
      await queryClient.invalidateQueries()

      const urlListener = Linking.addEventListener('url', async (event) => {
        if (event.url.startsWith(REDIRECT_URI)) {
          try {
            await WebBrowser.dismissBrowser()
          } catch {
            // Browser can already be closed depending on iOS hand-off timing.
          } finally {
            urlListener.remove()
          }
        }
      })

      return WebBrowser.openAuthSessionAsync(`${END_SESSION_ENDPOINT}?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`, REDIRECT_URI)
    },
    onError: (error) => {
      ErrorMonitor.log('Cannot open web browser on disconnect', {
        error: error,
      })
    },
  })
}
