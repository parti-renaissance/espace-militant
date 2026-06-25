import { useToastController } from '@tamagui/toast'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { useSession } from '@/ctx/SessionProvider'
import { getAlerts } from '@/services/alerts/api'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { GenericResponseError } from '@/services/common/errors/generic-errors'

import { createPronosticParticipation, getPronostic, getPublicAlerts } from './api'
import { RestPronosticDataSchema, type RestPostPronosticParticipationRequest, type RestPronosticData } from './schema'

const ALERTS_QUERY_KEY = 'alerts'
const PRONOSTIC_ALERTS_QUERY_KEY = 'pronostic-alerts'
const PRONOSTIC_QUERY_KEY = 'pronostic'

const findPronosticAlert = (alerts?: RestAlertsResponse) => alerts?.find((alert) => alert.type?.toLowerCase() === 'pronostic')

const parsePronosticAlert = (alert?: RestAlertsResponse[number]): { data: RestPronosticData; imageUrl?: string } | null => {
  if (!alert?.data) return null

  const parsed = RestPronosticDataSchema.safeParse(alert.data)
  if (!parsed.success) return null

  return { data: parsed.data, imageUrl: parsed.data.image_url ?? undefined }
}

export const useCurrentPronostic = () => {
  const { isAuth, isLoading: isSessionLoading } = useSession()
  const alertsQuery = useQuery({
    queryKey: [PRONOSTIC_ALERTS_QUERY_KEY, isAuth],
    queryFn: () => (isAuth ? getAlerts() : getPublicAlerts()),
    enabled: !isSessionLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
  })

  return {
    pronostic: parsePronosticAlert(findPronosticAlert(alertsQuery.data)),
    isLoading: isSessionLoading || alertsQuery.isLoading,
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
