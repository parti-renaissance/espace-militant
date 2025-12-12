import * as api from '@/services/stats/api'
import { useQuery } from '@tanstack/react-query'

export const usePublicationStats = (props: { uuid: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['publication-stats', props.uuid],
    queryFn: () => api.getPublicationStats({ uuid: props.uuid }),
    enabled: props.enabled !== false,
    staleTime: (query) => (query.state.error ? 0 : 60 * 1000),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

export const useEventStats = (props: { uuid: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['event-stats', props.uuid],
    queryFn: () => api.getEventStats({ uuid: props.uuid }),
    enabled: props.enabled !== false,
    staleTime: (query) => (query.state.error ? 0 : 60 * 1000),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}
