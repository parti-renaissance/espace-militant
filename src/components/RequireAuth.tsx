import { PropsWithChildren, useCallback } from 'react';
import { Href, Redirect, router, useRootNavigationState, usePathname } from 'expo-router';

import { useSession } from '@/ctx/SessionProvider';

const buildSignupHref = (redirectUri: string): Href => ({ pathname: '/(signup)/inscription', params: { redirectUri } }) as Href

export function useRequireAuth() {
  const { isAuth, isLoading } = useSession()
  const pathname = usePathname()

  const redirectToSignup = useCallback(() => {
    router.push(buildSignupHref(pathname))
  }, [pathname])

  return { isAuth, isLoading, redirectToSignup }
}

export function RequireAuth({ children }: PropsWithChildren) {
  const { isAuth, isLoading } = useSession()
  const pathname = usePathname()
  const isNavigationReady = useRootNavigationState()?.key != null

  if (isLoading || !isNavigationReady) return null

  if (!isAuth) {
    return <Redirect href={buildSignupHref(pathname)} />
  }

  return <>{children}</>
}
