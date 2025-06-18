import React, { useMemo } from 'react'
import useLogin, { useRegister } from '@/hooks/useLogin'
import { useLogOut } from '@/services/logout/api'
import { useGetProfil, useGetUserScopes } from '@/services/profile/hook'
import { User, useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { useToastController } from '@tamagui/toast'
import { parse, useURL } from 'expo-linking'
import { Href, router, useGlobalSearchParams } from 'expo-router'
import { isWeb } from 'tamagui'

type AuthContext = {
  signIn: (props?: { code?: string; isAdmin?: boolean; state?: string }) => Promise<void>
  signOut: () => Promise<void>
  signUp: (props?: { utm_campaign?: string }) => Promise<void>
  isAuth: boolean
  session?: User | null
  isLoading: boolean
  user: ReturnType<typeof useGetProfil>
  scope: ReturnType<typeof useGetUserScopes>
}

export const AuthContext = React.createContext<AuthContext>({
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signUp: (props?: { utm_campaign?: string }) => Promise.resolve(),
  isAuth: false,
  session: null,
  isLoading: false,
  user: {} as ReturnType<typeof useGetProfil>,
  scope: {} as ReturnType<typeof useGetUserScopes>,
})

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />')
    }
  }

  return value
}

export function SessionProvider(props: React.PropsWithChildren) {
  const { user: existingSession, setCredentials: setSession, _hasHydrated } = useUserStore()
  const params = useGlobalSearchParams<{ code?: string; _switch_user?: string; redirect?: string; state?: string }>()
  const [onShotParams, setOneShotParams] = React.useState(params)

  const url = useURL()

  const [isLoginInProgress, setIsLoginInProgress] = React.useState(false)
  const toast = useToastController()

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

  const handleSignIn: AuthContext['signIn'] = React.useCallback(
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
        const { accessToken, refreshToken, idToken: sessionId } = session
        setSession({ accessToken, refreshToken, sessionId, isAdmin: props?.isAdmin })
      } catch (e) {
        ErrorMonitor.log(e.message, { e })
        toast.show('Erreur lors de la connexion', { type: 'error' })
      } finally {
        setIsLoginInProgress(false)
      }
    },
    [isLoginInProgress, login],
  )

  React.useEffect(() => {
    const { code, _switch_user } = onShotParams
    if (code || url) {
      if (isWeb && code) {
        setOneShotParams({})
        handleSignIn({ code, isAdmin: _switch_user === 'true' })
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

  const handleRegister = React.useCallback(async (props?: { utm_campaign?: string }) => {
    try {
      const session = await register(props)
      if (!session) {
        return
      }
      const { accessToken, refreshToken, idToken: sessionId } = session
      setSession({ accessToken, refreshToken, sessionId })
    } catch (e) {
      ErrorMonitor.log(e.message, { e })
      toast.show('Erreur lors de la connexion', { type: 'error' })
    }
  }, [isLoginInProgress])

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
        user,
        scope,
      }) satisfies AuthContext,
    [handleSignIn, handleSignOut, existingSession, isLoginInProgress, isGlobalLoading],
  )

  return <AuthContext.Provider value={providerValue}>{props.children}</AuthContext.Provider>
}
