import * as helpers from '@/services/common/helpers'
import * as FeedMapper from '@/services/common/mapper/mapTimelineFeedToRestEvent'
import { isPartialEvent, RestEvent, RestFullEvent } from '@/services/events/schema'
import { optimisticFeedUpdate, optimisticToggleSubscribe as toggleSubscribeOnfeed } from '@/services/timeline-feed/hook/helpers'
import { QueryClient } from '@tanstack/react-query'
import { QUERY_KEY_PAGINATED_SHORT_EVENTS, QUERY_KEY_SINGLE_EVENT } from './queryKeys'

export const optimisticToggleSubscribe = async (subscribe: boolean, identifier: { eventId: string; slug?: string }, queryClient: QueryClient) => {
  const previousData = {
    shortEvents: helpers.getCachedPaginatedData<RestEvent>(queryClient, QUERY_KEY_PAGINATED_SHORT_EVENTS)!,
    event: helpers.getCachedSingleItem<RestEvent>(identifier.slug ?? identifier.eventId, queryClient, QUERY_KEY_SINGLE_EVENT),
  }

  const updateShortEvent: helpers.OptimisticItemUpdater<RestEvent> = (oldShortEventData) => {
    if (oldShortEventData === undefined) return undefined

    if (isPartialEvent(oldShortEventData)) return oldShortEventData
    return {
      ...oldShortEventData,
      user_registered_at: subscribe ? new Date().toISOString() : null,
      participants_count: subscribe ? (oldShortEventData.participants_count ?? 0) + 1 : (oldShortEventData.participants_count ?? 1) - 1,
    }
  }
  const optimisticParams = { updater: updateShortEvent, queryClient }
  toggleSubscribeOnfeed(subscribe, identifier.eventId, queryClient)
  helpers.optimisticSetPaginatedData({ ...optimisticParams, id: identifier.eventId, queryKey: QUERY_KEY_PAGINATED_SHORT_EVENTS })
  helpers.optimisticSetDataById({ ...optimisticParams, id: identifier.slug ?? identifier.eventId, queryKey: QUERY_KEY_SINGLE_EVENT })
  return previousData
}

export const optimisticUpdate = async (event: Partial<RestFullEvent>, identifier: { eventId: string; slug?: string }, queryClient: QueryClient) => {
  const previousData = {
    shortEvents: helpers.getCachedPaginatedData<RestEvent>(queryClient, QUERY_KEY_PAGINATED_SHORT_EVENTS)!,
    event: helpers.getCachedSingleItem<RestEvent>(identifier.slug ?? identifier.eventId, queryClient, QUERY_KEY_SINGLE_EVENT),
  }

  const updateShortEvent: helpers.OptimisticItemUpdater<RestEvent> = (oldShortEventData) => {
    if (oldShortEventData === undefined) return undefined

    if (isPartialEvent(oldShortEventData)) return oldShortEventData
    return {
      ...oldShortEventData,
      ...event,
    }
  }

  const optimisticParams = { updater: updateShortEvent, queryClient }
  optimisticFeedUpdate(FeedMapper.mapEventToFeed(event), identifier.eventId, queryClient)
  helpers.optimisticSetPaginatedData({ ...optimisticParams, id: identifier.eventId, queryKey: QUERY_KEY_PAGINATED_SHORT_EVENTS })
  helpers.optimisticSetDataById({ ...optimisticParams, id: identifier.slug ?? identifier.eventId, queryKey: QUERY_KEY_SINGLE_EVENT })
  return previousData
}
