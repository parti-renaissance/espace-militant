import type { PropsWithChildren } from 'react'
import { Redirect, usePathname, useSegments } from 'expo-router'
import { isWeb } from 'tamagui'

import { AuthRoutes, getAuthHref } from '@/features_next/signup/utils/authNavigation'

import { useSession } from '@/ctx/SessionProvider'
import { useUserStore } from '@/store/user-store'

const isSignupTunnelPublicPath = (pathname: string) => pathname === '/prono' || pathname.startsWith('/prono/')

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
  const isPublicPath = isSignupTunnelPublicPath(pathname)

  const shouldEnterSignupTunnel = !isWeb && hasHydrated && !isLoading && !isAuth && signupTunnelStatus === 'pending' && !isInSignupFlow && !isPublicPath

  if (shouldEnterSignupTunnel) {
    return <Redirect href={getAuthHref(AuthRoutes.BIENVENUE, pathname)} />
  }

  return children
}
