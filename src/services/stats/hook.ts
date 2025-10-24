import * as api from '@/services/stats/api'
import { useQuery } from '@tanstack/react-query'

export const usePublicationStats = (props: { uuid: string; scope: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['publication-stats', props.uuid, props.scope],
    queryFn: () => api.getPublicationStats({ uuid: props.uuid, scope: props.scope }),
    enabled: props.enabled !== false,
    staleTime: (query) => query.state.error ? 0 : 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

export const useEventStats = (props: { uuid: string; scope: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['event-stats', props.uuid, props.scope],
    queryFn: () => api.getEventStats({ uuid: props.uuid, scope: props.scope }),
    enabled: props.enabled !== false,
    staleTime: (query) => query.state.error ? 0 : 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

