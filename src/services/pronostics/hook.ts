import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createPronosticParticipation } from './api'
import type { RestCreatePronosticParticipationRequest } from './schema'

export const useCreatePronosticParticipation = (uuid?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RestCreatePronosticParticipationRequest) => {
      if (!uuid) throw new Error('Aucun pronostic disponible.')
      return createPronosticParticipation({ uuid, payload })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}
