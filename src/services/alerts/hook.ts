import { useSuspenseQuery } from '@tanstack/react-query'

import { useSession } from '@/ctx/SessionProvider'
import { getAlerts, getPublicAlerts } from '@/services/alerts/api'

export const ALERTS_QUERY_KEY = 'alerts' as const

export const useAlerts = () => {
  const { isAuth } = useSession()

  return useSuspenseQuery({
    queryKey: [ALERTS_QUERY_KEY, isAuth ? 'private' : 'public'],
    queryFn: () => (isAuth ? getAlerts() : getPublicAlerts()),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  })
}
