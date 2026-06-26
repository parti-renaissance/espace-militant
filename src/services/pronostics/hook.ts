import { useToastController } from '@tamagui/toast'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { useSession } from '@/ctx/SessionProvider'
import { GenericResponseError } from '@/services/common/errors/generic-errors'

import { createPronosticParticipation, getCurrentPronostic, getPronostic } from './api'
import { type RestGetPronosticResponse, type RestPostPronosticParticipationRequest } from './schema'

const CURRENT_PRONOSTIC_QUERY_KEY = 'current-pronostic'
const PRONOSTIC_QUERY_KEY = 'pronostic'

type CurrentPronosticQueryData = { data: RestGetPronosticResponse; imageUrl?: string } | null

export const useCurrentPronostic = () => {
  const { isAuth, isLoading: isSessionLoading } = useSession()
  const pronosticQuery = useQuery({
    queryKey: [CURRENT_PRONOSTIC_QUERY_KEY, isAuth],
    queryFn: async () => {
      const data = await getCurrentPronostic({ isAuth })
      return data ? { data } : null
    },
    enabled: !isSessionLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  })

  return {
    pronostic: pronosticQuery.data,
    isLoading: isSessionLoading || pronosticQuery.isLoading,
    isRefetching: pronosticQuery.isRefetching,
    refetch: pronosticQuery.refetch,
  }
}

export const usePronostic = (uuid: string) =>
  useSuspenseQuery({
    queryKey: [PRONOSTIC_QUERY_KEY, uuid],
    queryFn: () => getPronostic({ uuid }),
    staleTime: 10 * 1000,
  })

export const useCreatePronosticParticipation = (uuid?: string) => {
  const toast = useToastController()
  const queryClient = useQueryClient()
  const updateCurrentPronostic = (current?: CurrentPronosticQueryData, payload?: RestPostPronosticParticipationRequest): CurrentPronosticQueryData => {
    if (!current || current.data.uuid !== uuid) return current ?? null

    return {
      ...current,
      data: {
        ...current.data,
        participation: payload,
        status: 'participated',
      },
    }
  }

  return useMutation({
    mutationFn: (payload: RestPostPronosticParticipationRequest) => {
      if (!uuid) throw new Error('Aucun pronostic disponible.')
      return createPronosticParticipation({ uuid, payload })
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: [CURRENT_PRONOSTIC_QUERY_KEY] })
      const previousCurrentPronostics = queryClient.getQueriesData<CurrentPronosticQueryData>({ queryKey: [CURRENT_PRONOSTIC_QUERY_KEY] })

      queryClient.setQueriesData<CurrentPronosticQueryData>({ queryKey: [CURRENT_PRONOSTIC_QUERY_KEY] }, (current) => updateCurrentPronostic(current, payload))

      return { previousCurrentPronostics }
    },
    onError: (error, _payload, context) => {
      context?.previousCurrentPronostics?.forEach(([key, data]) => queryClient.setQueryData(key, data))

      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: "Impossible d'enregistrer ton pronostic.", type: 'error' })
      }

      return error
    },
    onSuccess: (_data, payload) => {
      toast.show('Prono enregistré', { message: `Ton score : ${payload.team_1_score} - ${payload.team_2_score}`, type: 'success' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CURRENT_PRONOSTIC_QUERY_KEY] })
      if (uuid) queryClient.invalidateQueries({ queryKey: [PRONOSTIC_QUERY_KEY, uuid] })
    },
  })
}
