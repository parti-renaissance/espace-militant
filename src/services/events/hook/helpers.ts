import * as helpers from '@/services/common/helpers'
import * as FeedMapper from '@/services/common/mapper/mapTimelineFeedToRestEvent'
import { isPartialEvent, RestEvent, RestFullEvent } from '@/services/events/schema'
import { getCachedHubQueries, patchHubSubscription, restoreHubQueries } from '@/services/hub/helpers'
import {
  getCachedPaginatedShortFeedItems,
  optimisticFeedUpdate,
  optimisticToggleSubscribe as toggleSubscribeOnfeed,
} from '@/services/timeline-feed/hook/helpers'
import { QueryClient } from '@tanstack/react-query'
import { QUERY_KEY_PAGINATED_SHORT_EVENTS, QUERY_KEY_SINGLE_EVENT } from './queryKeys'

export type OptimisticSubscribeSnapshot = {
  shortEvents: ReturnType<typeof helpers.getCachedPaginatedData<RestEvent>>
  shortFeedItems: ReturnType<typeof getCachedPaginatedShortFeedItems>
  hub: ReturnType<typeof getCachedHubQueries>
  eventQueryKey: readonly [string, string]
  event: RestEvent | undefined
}

export const rollbackOptimisticSubscribe = (queryClient: QueryClient, snapshot: OptimisticSubscribeSnapshot | undefined) => {
  if (!snapshot) return

  snapshot.shortEvents?.forEach(([key, data]) => {
    queryClient.setQueryData(key, data)
  })
  snapshot.shortFeedItems?.forEach(([key, data]) => {
    queryClient.setQueryData(key, data)
  })
  queryClient.setQueryData(snapshot.eventQueryKey, snapshot.event)
  restoreHubQueries(queryClient, snapshot.hub)
}

export const optimisticToggleSubscribe = async (
  subscribe: boolean,
  identifier: { eventId: string; slug?: string },
  queryClient: QueryClient,
): Promise<OptimisticSubscribeSnapshot> => {
  const eventQueryKey = [QUERY_KEY_SINGLE_EVENT, identifier.slug ?? identifier.eventId] as const
  const previousData: OptimisticSubscribeSnapshot = {
    shortEvents: helpers.getCachedPaginatedData<RestEvent>(queryClient, QUERY_KEY_PAGINATED_SHORT_EVENTS)!,
    shortFeedItems: getCachedPaginatedShortFeedItems(queryClient)!,
    hub: getCachedHubQueries(queryClient),
    eventQueryKey,
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
  patchHubSubscription(queryClient, { itemId: identifier.eventId, itemType: 'event', subscribe })
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
