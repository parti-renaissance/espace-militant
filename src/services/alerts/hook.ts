import { useSuspenseQuery } from '@tanstack/react-query'

import { getAlerts } from '@/services/alerts/api'

export const useAlerts = () => {
  return useSuspenseQuery({
    queryKey: ['alerts'],
    queryFn: () => getAlerts(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  })
}
