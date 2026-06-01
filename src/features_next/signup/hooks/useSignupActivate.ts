import { useCallback } from 'react'
import { Href, router } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'
import { getSignupErrorMessage } from '@/features_next/signup/utils/errors'

import { createPkcePair, credentialsFromTokenResponse, exchangeCodeAsync } from '@/hooks/useLogin'
import { useActivateSignup } from '@/services/signup/hook'
import { useUserStore } from '@/store/user-store'

export function useSignupActivate() {
  const queryClient = useQueryClient()
  const setCredentials = useUserStore((s) => s.setCredentials)
  const setInlineError = useSignupSessionStore((s) => s.setInlineError)
  const activateMutation = useActivateSignup()

  const resetSignupSession = useSignupSessionStore((s) => s.reset)

  const activateWithCode = useCallback(
    async (email: string, code: string) => {
      setInlineError(null)
      try {
        const { codeChallenge, codeVerifier } = await createPkcePair()
        const { code: authorizationCode } = await activateMutation.mutateAsync({ email, code, code_challenge: codeChallenge })

        const session = await exchangeCodeAsync({ code: authorizationCode, codeVerifier })
        if (!session) {
          throw new Error('Token exchange returned no session')
        }

        setCredentials(credentialsFromTokenResponse(session))
        resetSignupSession()
        queryClient.resetQueries()
        router.replace('/' as Href)
      } catch (error) {
        setInlineError(getSignupErrorMessage(error, 'Code incorrect. Vérifiez le code reçu par email.'))
      }
    },
    [activateMutation, queryClient, resetSignupSession, setCredentials, setInlineError],
  )

  return {
    activateWithCode,
    isActivating: activateMutation.isPending,
  }
}
