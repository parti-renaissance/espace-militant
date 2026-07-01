import { PropsWithChildren, useCallback } from 'react';
import { Redirect, router, useRootNavigationState, usePathname } from 'expo-router';

import { AuthRoutes, getAuthHref } from '@/features/signup/utils/authNavigation';
import { useSession } from '@/ctx/SessionProvider';

export function useRequireAuth() {
  const { isAuth, isLoading } = useSession()
  const pathname = usePathname()

  const redirectToSignup = useCallback(() => {
    router.push(getAuthHref(AuthRoutes.INSCRIPTION, pathname))
  }, [pathname])

  return { isAuth, isLoading, redirectToSignup }
}

export function RequireAuth({ children }: PropsWithChildren) {
  const { isAuth, isLoading, isLoggingOut } = useSession()
  const pathname = usePathname()
  const isNavigationReady = useRootNavigationState()?.key != null

  if (isLoading || !isNavigationReady || isLoggingOut) return null

  if (!isAuth) {
    return <Redirect href={getAuthHref(AuthRoutes.INSCRIPTION, pathname)} />
  }

  return <>{children}</>
}
