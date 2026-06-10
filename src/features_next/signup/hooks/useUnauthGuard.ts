import { useRootNavigationState } from 'expo-router'

import { useSession } from '@/ctx/SessionProvider'

export function useUnauthGuard() {
  const { isAuth, isLoading } = useSession()
  const isNavigationReady = useRootNavigationState()?.key != null

  return {
    isWaiting: isLoading || !isNavigationReady,
    shouldRedirect: !isLoading && isNavigationReady && isAuth,
  }
}
