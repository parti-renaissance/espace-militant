import { useCallback } from 'react'
import { Href, router } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'
import { getSignupErrorMessage } from '@/features_next/signup/utils/errors'

import clientEnv from '@/config/clientEnv'
import { createPkcePair, credentialsFromTokenResponse, exchangeCodeAsync, REDIRECT_URI } from '@/hooks/useLogin'
import { useActivateSignup } from '@/services/signup/hook'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'


export function useSignupActivate() {
  const queryClient = useQueryClient()
  const setCredentials = useUserStore((s) => s.setCredentials)
  const setInlineError = useSignupSessionStore((s) => s.setInlineError)
  const setRequiresManualLogin = useSignupSessionStore((s) => s.setRequiresManualLogin)
  const firstName = useSignupSessionStore((s) => s.firstName)
  const redirectUri = useSignupSessionStore((s) => s.redirectUri)
  const activateMutation = useActivateSignup()

  const resetSignupSession = useSignupSessionStore((s) => s.reset)

  const activateWithCode = useCallback(
    async (email: string, code: string) => {
      setInlineError(null)
      setRequiresManualLogin(false)

      let activated = false
      try {
        const { codeChallenge, codeVerifier } = await createPkcePair()
        const { code: authorizationCode } = await activateMutation.mutateAsync({
          email,
          code,
          code_challenge: codeChallenge,
          client_id: clientEnv.OAUTH_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
        })
        activated = true

        const session = await exchangeCodeAsync({ code: authorizationCode, codeVerifier })
        if (!session) {
          throw new Error('Token exchange returned no session')
        }

        setCredentials(credentialsFromTokenResponse(session))
        queryClient.resetQueries()
        if (redirectUri) {
          router.replace(redirectUri as Href)
        } else {
          router.replace({
            pathname: '/',
            params: { signupCongrats: '1', firstName: firstName || undefined },
          })
        }
        resetSignupSession()
      } catch (error) {
        if (activated) {
          ErrorMonitor.logError({ message: 'Signup token exchange failed after activation', domain: 'signup', error })
          setInlineError('Votre compte a bien été créé, mais la connexion automatique a échoué. Connectez-vous pour accéder à votre espace.')
          setRequiresManualLogin(true)
          return
        }
        setInlineError(getSignupErrorMessage(error, 'Code incorrect. Vérifiez le code reçu par email.'))
      }
    },
    [activateMutation, firstName, redirectUri, queryClient, resetSignupSession, setCredentials, setInlineError, setRequiresManualLogin],
  )

  return {
    activateWithCode,
    isActivating: activateMutation.isPending,
  }
}
