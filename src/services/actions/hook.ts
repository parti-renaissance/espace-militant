import { useToastController } from '@tamagui/toast'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import * as helpers from '@/services/common/helpers'
import { hubKeys } from '@/services/hub/hook'
import {
  getCachedHubQueries,
  invalidateHubQueries,
  patchHubSubscription,
  restoreHubQueries,
  type HubQueriesSnapshot,
} from '@/services/hub/helpers'
import { getCachedPaginatedShortFeedItems, optimisticToggleSubscribe as toggleSubscribeOnfeed } from '@/services/timeline-feed/hook/helpers'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import type { RestProfilResponse } from '@/services/profile/schema'

import * as api from './api'
import { ActionFormError } from './error'
import { getActionMutationErrorMessage, logActionMutationError } from './logActionMutation'
import type { RestPostActionRequest } from './schema'
import { isFullAction, RestAction, RestActionFull, RestActionParticipant } from './schema'

export const QUERY_KEY_ACTION = 'action'

type ActionSubscribeSnapshot = {
  hub: HubQueriesSnapshot
  action: RestAction | RestActionFull | undefined
  shortFeedItems: ReturnType<typeof getCachedPaginatedShortFeedItems>
}

const createParticipant = (me: RestProfilResponse): RestActionParticipant => ({
  uuid: me.uuid,
  adherent: { uuid: me.uuid, first_name: me.first_name, last_name: me.last_name, image_url: me.image_url ?? null },
  is_present: false,
  created_at: new Date(),
  updated_at: new Date(),
})

const optimisticToggleSubscribeOnCaches = (
  me: RestProfilResponse,
  subscribe: boolean,
  actionId: string,
  queryClient: ReturnType<typeof useQueryClient>,
): ActionSubscribeSnapshot => {
  const snapshot: ActionSubscribeSnapshot = {
    hub: getCachedHubQueries(queryClient),
    action: queryClient.getQueryData<RestAction | RestActionFull>([QUERY_KEY_ACTION, actionId]),
    shortFeedItems: getCachedPaginatedShortFeedItems(queryClient)!,
  }

  const updateAction: helpers.OptimisticItemUpdater<RestAction | RestActionFull> = (old) => {
    if (!old) return undefined

    const participant = createParticipant(me)

    return {
      ...old,
      user_registered_at: subscribe ? new Date() : null,
      ...(isFullAction(old)
        ? {
            // Some stale caches can miss participants at runtime.
            participants: subscribe
              ? [participant, ...(old.participants ?? [])]
              : (old.participants ?? []).filter((x) => x.adherent.uuid !== me.uuid),
          }
        : {
            participants_count: old.participants_count + (subscribe ? 1 : -1),
            // Some stale caches can miss first_participants at runtime.
            first_participants: subscribe
              ? [participant, ...(old.first_participants ?? [])]
              : (old.first_participants ?? []).filter((x) => x.adherent.uuid !== me.uuid),
          }),
    }
  }

  toggleSubscribeOnfeed(subscribe, actionId, queryClient)
  helpers.optimisticSetDataById({ id: actionId, updater: updateAction, queryClient, queryKey: QUERY_KEY_ACTION })
  patchHubSubscription(queryClient, { itemId: actionId, itemType: 'action', subscribe })

  return snapshot
}

const rollbackActionSubscribe = (queryClient: ReturnType<typeof useQueryClient>, actionId: string, snapshot: ActionSubscribeSnapshot | undefined) => {
  if (!snapshot) return

  restoreHubQueries(queryClient, snapshot.hub)
  snapshot.shortFeedItems?.forEach(([key, data]) => {
    queryClient.setQueryData(key, data)
  })
  queryClient.setQueryData([QUERY_KEY_ACTION, actionId], snapshot.action)
}

export const useAction = ({ id }: { id: string }) => {
  return useSuspenseQuery({
    queryKey: [QUERY_KEY_ACTION, id],
    queryFn: () => api.getAction({ id }),
    staleTime: 10_000,
  })
}

export const useActionMutation = ({ actionId }: { actionId?: string } = {}) => {
  const queryClient = useQueryClient()
  const toast = useToastController()
  const isEdit = Boolean(actionId)

  return useMutation({
    mutationFn: ({ payload }: { payload: RestPostActionRequest }) => {
      if (isEdit && actionId) {
        return api.updateAction({ id: actionId, payload })
      }
      return api.createAction(payload)
    },
    onSuccess: (data) => {
      const message = isEdit ? 'L’action a bien été modifiée' : 'L’action a bien été créée'
      toast.show('Succès', { message, type: 'success' })
      queryClient.setQueryData([QUERY_KEY_ACTION, data.uuid], data)
      invalidateHubQueries(queryClient)
    },
    onError: (error) => {
      const fallback = isEdit ? 'Impossible de modifier l’action' : 'Impossible de créer l’action'
      logActionMutationError(isEdit ? 'onError — update' : 'onError — create', error, { actionId })
      if (error instanceof ActionFormError) {
        toast.show('Validation', {
          message: getActionMutationErrorMessage(error, 'Un ou plusieurs champs sont invalides.'),
          type: 'warning',
        })
      } else {
        toast.show('Erreur', { message: getActionMutationErrorMessage(error, fallback), type: 'error' })
      }
    },
  })
}

export const useCancelAction = () => {
  const queryClient = useQueryClient()
  const toast = useToastController()

  return useMutation({
    mutationFn: ({ id }: { id: string }) => api.cancelAction({ id }),
    onSuccess: (_, { id }) => {
      toast.show('Succès', { message: 'L’action a bien été annulée', type: 'success' })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ACTION, id] })
      invalidateHubQueries(queryClient)
    },
    onError: (error) => {
      const fallback = 'Impossible d’annuler cette action'
      logActionMutationError('onError — cancel', error)
      toast.show('Erreur', { message: getActionMutationErrorMessage(error, fallback), type: 'error' })
    },
  })
}

export const useSubscribeAction = (id?: string) => {
  const queryClient = useQueryClient()
  const toast = useToastController()
  const user = useGetSuspenseProfil()

  return useMutation({
    mutationFn: () => {
      if (!user.data) {
        return Promise.reject(new Error("L'utilisateur est introuvable"))
      }
      return id ? api.subscribeToAction(id) : Promise.reject(new Error('No id provided'))
    },
    onMutate: async () => {
      if (!id || !user.data) return undefined

      await queryClient.cancelQueries({ queryKey: hubKeys.all })
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY_ACTION, id] })
      return optimisticToggleSubscribeOnCaches(user.data, true, id, queryClient)
    },
    onSuccess: () => {
      toast.show('Succès', { message: 'Inscription à l’action réussie', type: 'success' })
      invalidateHubQueries(queryClient)
    },
    onError: (error, _, context) => {
      if (id) rollbackActionSubscribe(queryClient, id, context)
      const fallback = 'Impossible de s’inscrire à l’action'
      logActionMutationError('onError — subscribe', error, { id })
      toast.show('Erreur', { message: getActionMutationErrorMessage(error, fallback), type: 'error' })
    },
  })
}

export const useUnsubscribeAction = (id?: string) => {
  const queryClient = useQueryClient()
  const toast = useToastController()
  const user = useGetSuspenseProfil()

  return useMutation({
    mutationFn: () => {
      if (!user.data) {
        return Promise.reject(new Error("L'utilisateur est introuvable"))
      }
      return id ? api.unsubscribeFromAction(id) : Promise.reject(new Error('No id provided'))
    },
    onMutate: async () => {
      if (!id || !user.data) return undefined

      await queryClient.cancelQueries({ queryKey: hubKeys.all })
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY_ACTION, id] })
      return optimisticToggleSubscribeOnCaches(user.data, false, id, queryClient)
    },
    onSuccess: () => {
      toast.show('Succès', { message: 'Désinscription de l’action réussie', type: 'success' })
      invalidateHubQueries(queryClient)
    },
    onError: (error, _, context) => {
      if (id) rollbackActionSubscribe(queryClient, id, context)
      const fallback = 'Impossible de se désinscrire de l’action'
      logActionMutationError('onError — unsubscribe', error, { id })
      toast.show('Erreur', { message: getActionMutationErrorMessage(error, fallback), type: 'error' })
    },
  })
}

/** @deprecated Use useAction */
export const useGetAction = useAction
