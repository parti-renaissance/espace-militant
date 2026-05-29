import { useCallback } from 'react'
import { Href, router } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'
import { getSignupErrorMessage } from '@/features_next/signup/utils/errors'
import { useActivateSignup } from '@/services/signup/hook'
import type { RestPostSignupActivateResponse } from '@/services/signup/schema'
import { useUserStore } from '@/store/user-store'

export function useSignupActivate() {
  const queryClient = useQueryClient()
  const setCredentials = useUserStore((s) => s.setCredentials)
  const setInlineError = useSignupSessionStore((s) => s.setInlineError)
  const activateMutation = useActivateSignup()

  const resetSignupSession = useSignupSessionStore((s) => s.reset)

  const onActivateSuccess = useCallback(
    (response: RestPostSignupActivateResponse) => {
      setCredentials({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        sessionId: response.id_token,
        accessTokenExpiresIn: response.expires_in,
      })
      resetSignupSession()
      queryClient.resetQueries()
      router.replace('/' as Href)
    },
    [queryClient, resetSignupSession, setCredentials],
  )

  const activateWithCode = useCallback(
    async (email: string, code: string) => {
      setInlineError(null)
      try {
        const response = await activateMutation.mutateAsync({ email, code })
        onActivateSuccess(response)
      } catch (error) {
        setInlineError(getSignupErrorMessage(error, 'Code incorrect. Vérifiez le code reçu par email.'))
      }
    },
    [activateMutation, onActivateSuccess, setInlineError],
  )

  return {
    activateWithCode,
    isActivating: activateMutation.isPending,
  }
}
