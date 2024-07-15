import React, { useMemo } from 'react'
import useAsyncState from '@/hooks/useAsyncState'
import useLogin, { useRegister } from '@/hooks/useLogin'
import { useGetProfil, useGetUserScopes } from '@/hooks/useProfil'
import { useLogOut } from '@/services/logout/api'
import { User, useUserStore } from '@/store/user-store'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { useToastController } from '@tamagui/toast'
import { router, useLocalSearchParams } from 'expo-router'

type AuthContext = {
  signIn: (props?: { code: string }) => Promise<void>
  signOut: () => Promise<void>
  signUp: () => Promise<void>
  isAuth: boolean
  session?: User | null
  isLoading: boolean
  user: ReturnType<typeof useGetProfil>
  scope: ReturnType<typeof useGetUserScopes>
}

const AuthContext = React.createContext<AuthContext>({
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
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
  const { user: session, setCredentials: setSession, _hasHydrated } = useUserStore()
  const { redirect: pRedirect } = useLocalSearchParams<{ redirect?: string }>()

  const [isLoginInProgress, setIsLoginInProgress] = React.useState(false)
  const toast = useToastController()

  React.useEffect(() => {
    if (session && pRedirect) {
      pRedirect && router.replace({ pathname: pRedirect })
    }
  }, [session, pRedirect])

  const login = useLogin()
  const { mutateAsync: logout } = useLogOut()
  const register = useRegister()
  const user = useGetProfil({ enabled: !!session })
  const scope = useGetUserScopes({ enabled: !!user.data })

  const isGlobalLoading = [isLoginInProgress, user.isLoading, !_hasHydrated].some(Boolean)
  const isAuth = Boolean(session && !isGlobalLoading)

  const handleSignIn: AuthContext['signIn'] = async (props) => {
    try {
      setIsLoginInProgress(true)
      const session = await login(props?.code)
      if (!session) {
        return
      }
      const { accessToken, refreshToken } = session
      setSession({ accessToken, refreshToken })
    } catch (e) {
      ErrorMonitor.log(e.message, { e })
      toast.show('Erreur lors de la connexion', { type: 'error' })
    } finally {
      setIsLoginInProgress(false)
    }
  }

  const handleRegister = async () => {
    try {
      setIsLoginInProgress(true)
      const session = await register()
      if (!session) {
        return
      }
      const { accessToken, refreshToken } = session
      setSession({ accessToken, refreshToken })
      // await loginInteractor.current.setUpLogin()
    } catch (e) {
      console.log('error', e)
      ErrorMonitor.log(e.message, { e })
      toast.show('Erreur lors de la connexion', { type: 'error' })
    } finally {
      setIsLoginInProgress(false)
    }
  }

  const handleSignOut = async () => {
    await logout()
  }

  const providerValue = useMemo(
    () =>
      ({
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleRegister,
        session,
        isLoading: isGlobalLoading,
        isAuth,
        user,
        scope,
      }) satisfies AuthContext,
    [handleSignIn, handleSignOut, session, isLoginInProgress],
  )

  return <AuthContext.Provider value={providerValue}>{props.children}</AuthContext.Provider>
}
