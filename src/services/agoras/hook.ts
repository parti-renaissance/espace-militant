import * as api from './api'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastController } from '@tamagui/toast'

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
        message: 'Agora mise à jour',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['profil', 'instances'] })
    },
    onError: () => {
      toast.show('Erreur', {
        message: 'Impossible de mettre à jour le profil',
        type: 'error',
      })
    },
  })
}
