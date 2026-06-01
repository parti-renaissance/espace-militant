import type { PropsWithChildren } from 'react'
import { Href, Redirect, useSegments } from 'expo-router'
import { isWeb } from 'tamagui'

import { useSession } from '@/ctx/SessionProvider'
import { useUserStore } from '@/store/user-store'

/**
 * Mobile uniquement : affiche le tunnel signup tant que l'utilisateur
 * n'est pas connecté et n'a ni passé (« Passer ») ni terminé l'inscription.
 */
export default function SignupTunnelGuard({ children }: PropsWithChildren) {
  const { isAuth, isLoading } = useSession()
  const signupTunnelStatus = useUserStore((s) => s.signupTunnelStatus)
  const hasHydrated = useUserStore((s) => s._hasHydrated)
  const isInSignupGroup = useSegments()[0] === '(signup)'

  const shouldEnterSignupTunnel =
    !isWeb &&
    hasHydrated &&
    !isLoading &&
    !isAuth &&
    signupTunnelStatus === 'pending' &&
    !isInSignupGroup

  if (shouldEnterSignupTunnel) {
    return <Redirect href={'/(signup)/bienvenue' as Href} />
  }

  return children
}
