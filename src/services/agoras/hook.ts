import * as api from './api'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastController } from '@tamagui/toast'
import { PAGINATED_QUERY_FEED } from '../timeline-feed/hook'
import { QUERY_KEY_PAGINATED_SHORT_EVENTS } from '../events/hook/queryKeys'

export const usePaginatedAgoras = () => {
  return useInfiniteQuery({
    queryKey: ['agoras'],
    queryFn: ({ pageParam = 1 }) => api.getAgoras({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.last_page
        ? lastPage.metadata.current_page + 1
        : null,
    getPreviousPageParam: (firstPage) =>
      firstPage.metadata.current_page > 1 ? firstPage.metadata.current_page - 1 : null,
    placeholderData: (prev) => prev,
  })
} 

export const useSetMyAgora = () => {
  const queryClient = useQueryClient()
  const toast = useToastController()

  return useMutation({
    mutationKey: ['setMyAgora'],
    mutationFn: (uuid: string) =>
      api.setMyAgora(uuid),
    onSuccess: () => {
      toast.show('Succès', {
        message: 'Vous êtes maintenant membre de cette agora',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['profil', 'instances', PAGINATED_QUERY_FEED, QUERY_KEY_PAGINATED_SHORT_EVENTS] })
    },
    onError: () => {
      toast.show('Erreur', {
        message: 'Nous n’avons pas pu vous ajouter à cette agora',
        type: 'error',
      })
    },
  })
}

export const useLeaveMyAgora = () => {
  const queryClient = useQueryClient()
  const toast = useToastController()

  return useMutation({
    mutationKey: ['leaveMyAgora'],
    mutationFn: (uuid: string) => api.leavetMyAgora(uuid),
    onSuccess: () => {
      toast.show('Succès', {
        message: 'Vous avez quitté cette agora',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['profil', 'instances', PAGINATED_QUERY_FEED, QUERY_KEY_PAGINATED_SHORT_EVENTS] })
    },
    onError: () => {
      toast.show('Erreur', {
        message: 'Nous n’avons pas pu vous retirer de cette agora',
        type: 'error',
      })
    },
  })
}