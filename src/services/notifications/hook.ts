import * as api from '@/services/notifications/api'
import { PROFIL_QUERY_KEY } from '@/services/profile/hook'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

export const useGetNotificationList = () => {
  return useSuspenseQuery({
    queryKey: ['notificationList'],
    queryFn: () => api.getNotificationList(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useUnsubscribe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.unsubscribe(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PROFIL_QUERY_KEY] }),
  })
}

export const useGetReSubscribeConfig = () => {
  return useSuspenseQuery({
    queryKey: ['reSubscribeConfig'],
    queryFn: () => api.getReSubscribeConfig(),
  })
}
