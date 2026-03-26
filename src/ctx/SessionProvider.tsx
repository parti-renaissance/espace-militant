import React, { useMemo } from 'react'
import { parse, useURL } from 'expo-linking'
import { Href, router, useGlobalSearchParams } from 'expo-router'
import { isWeb } from 'tamagui'
import { useToastController } from '@tamagui/toast'

import { useQueryClient } from '@tanstack/react-query'

import useLogin, { useRegister } from '@/hooks/useLogin'
import { useLogOut } from '@/services/logout/api'
import { useGetProfil, useGetUserScopes } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

import { AuthContext, type AuthContextType } from './AuthContext'

export { useSession } from './AuthContext'

export function SessionProvider(props: React.PropsWithChildren) {
  const { user: existingSession, setCredentials: setSession, removeCredentials, _hasHydrated } = useUserStore()
  const params = useGlobalSearchParams<{ code?: string; _switch_user?: string; redirect?: string; state?: string }>()
  const [onShotParams, setOneShotParams] = React.useState(params)

  const url = useURL()

  const [isLoginInProgress, setIsLoginInProgress] = React.useState(false)
  const toast = useToastController()

  const queryClient = useQueryClient()
  const login = useLogin()
  const { mutateAsync: logout } = useLogOut()
  const register = useRegister()
  const user = useGetProfil({ enabled: !!existingSession })
  const scope = useGetUserScopes({ enabled: !!user.data })

  const isGlobalLoading = [isLoginInProgress, user.isLoading, scope.isLoading, !_hasHydrated].some(Boolean)
  const isAuth = Boolean(existingSession && !isGlobalLoading)

  React.useEffect(() => {
    const { state } = params
    if (existingSession && [state].some(Boolean) && !isGlobalLoading) {
      if (state?.startsWith('/')) {
        router.replace({ pathname: state } as Href)
      }
    }
  }, [existingSession, params, isGlobalLoading])

  const handleSignIn: AuthContextType['signIn'] = React.useCallback(
    async (props) => {
      try {
        if (isLoginInProgress) {
          return
        }
        setIsLoginInProgress(true)
        const session = await login({ code: props?.code, sessionId: existingSession?.sessionId, state: props?.state })
        if (!session) {
          return
        }
        const { accessToken, refreshToken, idToken: sessionId, expiresIn } = session
        setSession({ accessToken, refreshToken, sessionId, isAdmin: props?.isAdmin, accessTokenExpiresIn: expiresIn })
        queryClient.resetQueries()
      } catch (e) {
        ErrorMonitor.log(e.message, { e })
        toast.show('Erreur lors de la connexion', { type: 'error' })
      } finally {
        setIsLoginInProgress(false)
      }
    },
    [isLoginInProgress, login, queryClient],
  )

  React.useEffect(() => {
    const { code, state: stateParam, _switch_user } = onShotParams
    if (code || url) {
      if (isWeb && code) {
        if (_switch_user) {
          queryClient.cancelQueries()
          queryClient.clear()
          removeCredentials()
        }
        setOneShotParams({})
        const hadState = Boolean(stateParam?.startsWith('/'))
        handleSignIn({ code, isAdmin: _switch_user === 'true' }).then(() => {
          if (isWeb && !hadState) {
            router.replace('/' as Href)
          }
        })
      }
      if (url && !isWeb) {
        const { queryParams } = parse(url)
        const code = queryParams?.code as string | undefined

        if (code) {
          handleSignIn({ code })
        }
      }
    }
  }, [])

  const handleRegister = React.useCallback(
    async (props?: { utm_campaign?: string }) => {
      try {
        const session = await register(props)
        if (!session) {
          return
        }
        const { accessToken, refreshToken, idToken: sessionId, expiresIn } = session
        setSession({ accessToken, refreshToken, sessionId, accessTokenExpiresIn: expiresIn })
      } catch (e) {
        ErrorMonitor.log(e.message, { e })
        toast.show('Erreur lors de la connexion', { type: 'error' })
      }
    },
    [isLoginInProgress],
  )

  const handleSignOut = React.useCallback(async () => {
    await logout()
  }, [])

  const providerValue = useMemo(
    () =>
      ({
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleRegister,
        session: existingSession,
        isLoading: isGlobalLoading,
        isAuth,
        isAdmin: existingSession?.isAdmin === true,
        user,
        scope,
      }) satisfies AuthContextType,
    [handleSignIn, handleSignOut, handleRegister, existingSession, isGlobalLoading, isAuth, user, scope],
  )

  return <AuthContext.Provider value={providerValue}>{props.children}</AuthContext.Provider>
}
