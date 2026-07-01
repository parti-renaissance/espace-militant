import React, { useMemo } from 'react'
import { parse, useURL } from 'expo-linking'
import { Href, router } from 'expo-router'
import { isWeb } from 'tamagui'
import { useToastController } from '@tamagui/toast'
import { useQueryClient } from '@tanstack/react-query'

import { navigateToWelcome } from '@/features_next/signup/utils/authNavigation'

import { normalizeInternalRedirect, parseWebAuthState } from '@/hooks/pkceWebStore'
import useBfcacheRestore from '@/hooks/useBfcacheRestore'
import useLogin, { AuthFlowError, credentialsFromTokenResponse } from '@/hooks/useLogin'
import { useLogOut } from '@/services/logout/api'
import { useGetProfil, useGetUserScopes } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

import { AuthContext, type AuthContextType } from './AuthContext'

export { useSession } from './AuthContext'

const resolveStateRedirect = (state?: string) => normalizeInternalRedirect(parseWebAuthState(state).redirectPath)

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
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const toast = useToastController()

  useBfcacheRestore(() => {
    setIsLoginInProgress(false)
    void useUserStore.persist.rehydrate()
  })

  const queryClient = useQueryClient()
  const login = useLogin()
  const { mutateAsync: logout } = useLogOut({ setIsLoggingOut })
  const user = useGetProfil({ enabled: !!existingSession && !isLoggingOut })
  const scope = useGetUserScopes({ enabled: !!user.data && !isLoggingOut })

  const isGlobalLoading = [isLoginInProgress, user.isLoading, scope.isLoading, !_hasHydrated].some(Boolean)
  const isAuth = Boolean(existingSession && !isGlobalLoading && !isLoggingOut)

  const handleSignIn: AuthContextType['signIn'] = React.useCallback(
    async (props) => {
      let keepLoadingForWebRedirect = false
      try {
        // Allow OAuth callback (magic link / universal link) while promptAsync is still open.
        if (isLoginInProgress && !props?.code) {
          return
        }

        setIsLoginInProgress(true)
        const session = await login({ code: props?.code, sessionId: existingSession?.sessionId, state: props?.state, redirectUri: props?.redirectUri })
        if (!session) {
          keepLoadingForWebRedirect = isWeb && !props?.code
          return
        }
        setSession(credentialsFromTokenResponse(session, props?.isAdmin))
        queryClient.resetQueries()
        router.replace((resolveStateRedirect(props?.state) ?? '/') as Href)
      } catch (e) {
        const authSource = props?.code ? 'oauth_callback' : 'user_action'
        ErrorMonitor.logError({
          message: 'Login failed',
          domain: 'auth',
          error: e,
          extra: {
            hasCode: Boolean(props?.code),
            source: authSource,
            ...(e instanceof AuthFlowError && e.details !== undefined ? { details: e.details } : {}),
          },
          tags: { auth_source: authSource },
        })
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

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      ;['code', 'state', '_switch_user'].forEach((key) => params.delete(key))
      const query = params.toString()
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
    }
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
    const { scheme, hostname, queryParams } = parse(url)
    const code = queryParams?.code as string | undefined
    if (!code || processedCodeRef.current === code) return

    const state = queryParams?.state as string | undefined
    const redirectUri = scheme === 'https' && hostname ? `https://${hostname}` : undefined

    processedCodeRef.current = code
    void handleSignIn({ code, state, redirectUri })
  }, [url, handleSignIn])

  const handleRegister = React.useCallback(async () => {
    navigateToWelcome()
  }, [])

  const handleSignOut = React.useCallback(async () => {
    await logout()
  }, [logout])

  const providerValue = useMemo(
    () =>
      ({
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleRegister,
        session: existingSession,
        isLoading: isGlobalLoading,
        isAuth,
        isLoggingOut,
        isAdmin: existingSession?.isAdmin === true,
        user,
        scope,
      }) satisfies AuthContextType,
    [handleSignIn, handleSignOut, handleRegister, existingSession, isGlobalLoading, isAuth, isLoggingOut, user, scope],
  )

  return <AuthContext.Provider value={providerValue}>{props.children}</AuthContext.Provider>
}
