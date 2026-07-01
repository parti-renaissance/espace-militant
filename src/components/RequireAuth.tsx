import { PropsWithChildren, useCallback } from 'react'
import { Redirect, router, usePathname, useRootNavigationState } from 'expo-router'

import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import { useSession } from '@/ctx/SessionProvider'

export function useRequireAuth() {
  const { isAuth, isLoading } = useSession()
  const pathname = usePathname()

  const redirectToSignup = useCallback(() => {
    router.push(getAuthHref(AuthRoutes.INSCRIPTION, pathname))
  }, [pathname])

  return { isAuth, isLoading, redirectToSignup }
}

type RequireAuthProps = PropsWithChildren<{
  redirectPath?: string
}>

export function RequireAuth({ children, redirectPath }: RequireAuthProps) {
  const { isAuth, isLoading, isLoggingOut } = useSession()
  const pathname = usePathname()
  const redirectUri = redirectPath ?? pathname
  const isNavigationReady = useRootNavigationState()?.key != null

  if (isLoading || !isNavigationReady || isLoggingOut) return null

  if (!isAuth) {
    return <Redirect href={getAuthHref(AuthRoutes.INSCRIPTION, redirectUri)} />
  }

  return <>{children}</>
}
