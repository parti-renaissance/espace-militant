import React, { useMemo } from 'react'
import { parse, useURL } from 'expo-linking'
import { Href, router } from 'expo-router'
import { isWeb } from 'tamagui'
import { useToastController } from '@tamagui/toast'
import { useQueryClient } from '@tanstack/react-query'

import { navigateToSignup } from '@/features_next/signup/utils/navigateToSignup'

import useLogin, { credentialsFromTokenResponse } from '@/hooks/useLogin'
import { useLogOut } from '@/services/logout/api'
import { useGetProfil, useGetUserScopes } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

import { AuthContext, type AuthContextType } from './AuthContext'

export { useSession } from './AuthContext'

const normalizeStateRedirect = (state?: string) => {
  if (!state) return undefined

  try {
    const path = decodeURIComponent(state)
    return path.startsWith('/') && !path.startsWith('//') ? path : undefined
  } catch {
    return undefined
  }
}

export function SessionProvider(props: React.PropsWithChildren) {
  const { user: existingSession, setCredentials: setSession, removeCredentials, _hasHydrated } = useUserStore()

  const bootParams = React.useMemo<{ code?: string; state?: string; _switch_user?: string }>(() => {
    if (isWeb && typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search)
      return {
        code: search.get('code') ?? undefined,
        state: search.get('state') ?? undefined,
        _switch_user: search.get('_switch_user') ?? undefined,
      }
    }
    return {}
  }, [])

  const url = useURL()

  const [isLoginInProgress, setIsLoginInProgress] = React.useState(false)
  const toast = useToastController()

  const queryClient = useQueryClient()
  const login = useLogin()
  const { mutateAsync: logout } = useLogOut()
  const user = useGetProfil({ enabled: !!existingSession })
  const scope = useGetUserScopes({ enabled: !!user.data })

  const isGlobalLoading = [isLoginInProgress, user.isLoading, scope.isLoading, !_hasHydrated].some(Boolean)
  const isAuth = Boolean(existingSession && !isGlobalLoading)

  const handleSignIn: AuthContextType['signIn'] = React.useCallback(
    async (props) => {
      let keepLoadingForWebRedirect = false
      try {
        if (isLoginInProgress) {
          return
        }
        setIsLoginInProgress(true)
        const session = await login({ code: props?.code, sessionId: existingSession?.sessionId, state: props?.state })
        if (!session) {
          keepLoadingForWebRedirect = isWeb && !props?.code
          return
        }
        setSession(credentialsFromTokenResponse(session, props?.isAdmin))
        queryClient.resetQueries()
        router.replace((normalizeStateRedirect(props?.state) ?? '/') as Href)
      } catch (e) {
        ErrorMonitor.log(e.message, { e })
        toast.show('Erreur lors de la connexion', { type: 'error' })
      } finally {
        if (!keepLoadingForWebRedirect) {
          setIsLoginInProgress(false)
        }
      }
    },
    [isLoginInProgress, login, queryClient],
  )

  // Web boot: captures SSO `code`/`state` from the initial URL exactly once at mount.
  // `bootParams` is memoized with [] and the other values are stable refs from hooks,
  // so re-running the effect would only risk re-triggering signIn. Deps are intentionally empty.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!isWeb) return
    const { code, state, _switch_user } = bootParams
    if (!code) return
    if (_switch_user) {
      queryClient.cancelQueries()
      queryClient.clear()
      removeCredentials()
    }
    handleSignIn({ code, isAdmin: _switch_user === 'true', state })
  }, [])

  const processedCodeRef = React.useRef<string | undefined>(undefined)
  React.useEffect(() => {
    if (isWeb || !url) return
    const { queryParams } = parse(url)
    const code = queryParams?.code as string | undefined
    if (!code || processedCodeRef.current === code) return
    processedCodeRef.current = code

    const state = queryParams?.state as string | undefined
    handleSignIn({ code, state })
  }, [url, handleSignIn])

  const handleRegister = React.useCallback(async () => {
    navigateToSignup()
  }, [])

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
