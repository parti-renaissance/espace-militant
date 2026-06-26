import { useToastController } from '@tamagui/toast'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { useSession } from '@/ctx/SessionProvider'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { GenericResponseError } from '@/services/common/errors/generic-errors'

import { createPronosticParticipation, getCurrentPronostic, getPronostic } from './api'
import { type RestPostPronosticParticipationRequest } from './schema'

const ALERTS_QUERY_KEY = 'alerts'
const PRONOSTIC_ALERTS_QUERY_KEY = 'pronostic-alerts'
const PRONOSTIC_QUERY_KEY = 'pronostic'

export const useCurrentPronostic = () => {
  const { isAuth, isLoading: isSessionLoading } = useSession()
  const pronosticQuery = useQuery({
    queryKey: [PRONOSTIC_ALERTS_QUERY_KEY, isAuth],
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
  const updatePronosticAlert = (alerts?: RestAlertsResponse, payload?: RestPostPronosticParticipationRequest) =>
    alerts?.map((alert) =>
      alert.type?.toLowerCase() === 'pronostic' && alert.data?.uuid === uuid
        ? { ...alert, data: { ...alert.data, participation: payload, status: 'participated' } }
        : alert,
    )

  return useMutation({
    mutationFn: (payload: RestPostPronosticParticipationRequest) => {
      if (!uuid) throw new Error('Aucun pronostic disponible.')
      return createPronosticParticipation({ uuid, payload })
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: [ALERTS_QUERY_KEY] })
      await queryClient.cancelQueries({ queryKey: [PRONOSTIC_ALERTS_QUERY_KEY] })
      const previousAlerts = queryClient.getQueryData<RestAlertsResponse>([ALERTS_QUERY_KEY])
      const previousPronosticAlerts = queryClient.getQueriesData<RestAlertsResponse>({ queryKey: [PRONOSTIC_ALERTS_QUERY_KEY] })

      queryClient.setQueryData<RestAlertsResponse>([ALERTS_QUERY_KEY], (alerts) => updatePronosticAlert(alerts, payload))
      queryClient.setQueriesData<RestAlertsResponse>({ queryKey: [PRONOSTIC_ALERTS_QUERY_KEY] }, (alerts) => updatePronosticAlert(alerts, payload))

      return { previousAlerts, previousPronosticAlerts }
    },
    onError: (error, _payload, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData([ALERTS_QUERY_KEY], context.previousAlerts)
      }
      context?.previousPronosticAlerts?.forEach(([key, data]) => queryClient.setQueryData(key, data))

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
      queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [PRONOSTIC_ALERTS_QUERY_KEY] })
      if (uuid) queryClient.invalidateQueries({ queryKey: [PRONOSTIC_QUERY_KEY, uuid] })
    },
  })
}
