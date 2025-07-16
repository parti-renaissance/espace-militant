import { Action, isFullAction, RestActionParticipant } from '@/services/actions/schema'
import * as helpers from '@/services/common/helpers'
import { RestProfilResponse } from '@/services/profile/schema'
import { optimisticToggleSubscribe as toggleSubscribeOnfeed } from '@/services/timeline-feed/hook/helpers'
import { QueryClient } from '@tanstack/react-query'

export const QUERY_KEY_PAGINATED_ACTIONS = 'QUERY_KEY_PAGINATED_ACTIONS'
export const QUERY_KEY_ACTIONS = 'QUERY_KEY_ACTIONS'

const createParticipant = (me: RestProfilResponse): RestActionParticipant => ({
  uuid: me.uuid,
  adherent: { uuid: me.uuid, first_name: me.first_name, last_name: me.last_name, image_url: me.image_url ?? null },
  is_present: false,
  created_at: new Date(),
  updated_at: new Date(),
})

export const optimisticToggleSubscribe = (me: RestProfilResponse) => async (subscribe: boolean, actionId: string, queryClient: QueryClient) => {
  const updateAction: helpers.OptimisticItemUpdater<Action> = (oldShortEventData) => {
    if (!oldShortEventData) return undefined

    return {
      ...oldShortEventData,
      user_registered_at: subscribe ? new Date() : null,
      ...(isFullAction(oldShortEventData)
        ? {
            participants: subscribe
              ? [createParticipant(me), ...oldShortEventData.participants]
              : oldShortEventData.participants?.filter((x) => x.adherent.uuid !== me.uuid),
          }
        : {
            participants_count: oldShortEventData.participants_count + (subscribe ? 1 : -1),
            first_participants: subscribe
              ? [createParticipant(me), ...oldShortEventData.first_participants]
              : oldShortEventData.first_participants?.filter((x) => x.adherent.uuid !== me.uuid),
          }),
    } satisfies Action
  }
  const optimisticParams = { id: actionId, updater: updateAction, queryClient }
  toggleSubscribeOnfeed(subscribe, actionId, queryClient)
  helpers.optimisticSetPaginatedData({ ...optimisticParams, queryKey: QUERY_KEY_PAGINATED_ACTIONS })
  helpers.optimisticSetDataById({ ...optimisticParams, queryKey: QUERY_KEY_ACTIONS })
}

export const optimisticUpdate = async (updater: helpers.OptimisticItemUpdater<Action>, actionId: string, queryClient: QueryClient) => {
  const optimisticParams = { id: actionId, updater, queryClient }
  helpers.optimisticSetPaginatedData({ ...optimisticParams, queryKey: QUERY_KEY_PAGINATED_ACTIONS })
  helpers.optimisticSetDataById({ ...optimisticParams, queryKey: QUERY_KEY_ACTIONS })
}
