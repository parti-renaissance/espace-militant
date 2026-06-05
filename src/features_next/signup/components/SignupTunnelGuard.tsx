import type { PropsWithChildren } from 'react';
import { Href, Redirect, usePathname, useSegments } from 'expo-router'
import { isWeb } from 'tamagui';

import { useSession } from '@/ctx/SessionProvider';
import { useUserStore } from '@/store/user-store';

/**
 * Mobile uniquement : affiche le tunnel signup tant que l'utilisateur
 * n'est pas connecté et n'a ni passé (« Passer ») ni terminé l'inscription.
 */
export default function SignupTunnelGuard({ children }: PropsWithChildren) {
  const { isAuth, isLoading } = useSession()
  const signupTunnelStatus = useUserStore((s) => s.signupTunnelStatus)
  const hasHydrated = useUserStore((s) => s._hasHydrated)
  const segments = useSegments()
  const pathname = usePathname()

  const isInSignupFlow = segments[0] === '(signup)' || pathname.includes('inscription') || pathname.includes('bienvenue')

  const shouldEnterSignupTunnel =
    !isWeb &&
    hasHydrated &&
    !isLoading &&
    !isAuth &&
    signupTunnelStatus === 'pending' &&
    !isInSignupFlow

  if (shouldEnterSignupTunnel) {
    const href = (
      pathname && pathname !== '/'
        ? `/(signup)/inscription?redirectUri=${encodeURIComponent(pathname)}`
        : '/(signup)/inscription'
    ) as Href
    return <Redirect href={href} />
  }

  return children
}
