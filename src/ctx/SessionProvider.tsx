import React, { useMemo } from 'react'
import { parse, useURL } from 'expo-linking'
import { Href, router } from 'expo-router'
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

  const pendingRedirectRef = React.useRef<string | undefined>(normalizeStateRedirect(bootParams.state))
  const hasRedirectedRef = React.useRef(false)

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
    if (hasRedirectedRef.current) return
    const redirectState = pendingRedirectRef.current
    if (existingSession && redirectState && !isGlobalLoading) {
      hasRedirectedRef.current = true
      pendingRedirectRef.current = undefined
      router.replace(redirectState as Href)
    }
  }, [existingSession, isGlobalLoading])

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

  // Web boot: captures SSO `code`/`state` from the initial URL exactly once at mount.
  // `bootParams` is memoized with [] and the other values are stable refs from hooks,
  // so re-running the effect would only risk re-triggering signIn. Deps are intentionally empty.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!isWeb) return
    const { code, _switch_user } = bootParams
    if (!code) return
    if (_switch_user) {
      queryClient.cancelQueries()
      queryClient.clear()
      removeCredentials()
    }
    const hadState = Boolean(pendingRedirectRef.current)
    handleSignIn({ code, isAdmin: _switch_user === 'true' }).then(() => {
      if (!hadState) {
        router.replace('/' as Href)
      }
    })
  }, [])

  const processedCodeRef = React.useRef<string | undefined>(undefined)
  React.useEffect(() => {
    if (isWeb || !url) return
    const { queryParams } = parse(url)
    const code = queryParams?.code as string | undefined
    if (!code || processedCodeRef.current === code) return
    processedCodeRef.current = code

    const stateParam = queryParams?.state as string | undefined
    const redirectState = normalizeStateRedirect(stateParam)
    if (redirectState) {
      pendingRedirectRef.current = redirectState
      hasRedirectedRef.current = false
    }

    handleSignIn({ code })
  }, [url, handleSignIn])

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
