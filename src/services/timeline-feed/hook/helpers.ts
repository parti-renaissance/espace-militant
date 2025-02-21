import { RestTimelineFeedItem, RestTimelineFeedResponse } from '@/services/timeline-feed/schema'
import { InfiniteData, QueryClient } from '@tanstack/react-query'
import { PAGINATED_QUERY_FEED } from '.'

type ShortFeedItemUpdater = (oldShortFeedItemData: RestTimelineFeedItem) => RestTimelineFeedItem
type OptimisticFeedItemSetter = (params: { id: string; updater: ShortFeedItemUpdater; queryClient: QueryClient }) => void

export const optmisticSetPaginatedShortFeedItem: OptimisticFeedItemSetter = ({ id, queryClient, updater }) => {
  queryClient.setQueriesData<InfiniteData<RestTimelineFeedResponse>>(
    {
      queryKey: [PAGINATED_QUERY_FEED],
    },
    (oldPaginatedData) => {
      if (!oldPaginatedData) return oldPaginatedData
      const updatedPages = oldPaginatedData.pages.map((page) => {
        const updatedItems = page.hits.map((item) => {
          if (item.objectID === id) {
            const updated = updater(item)
            return updated
          }
          return item
        })
        return { ...page, hits: updatedItems }
      })
      return { ...oldPaginatedData, pages: updatedPages }
    },
  )
}

export const getCachedPaginatedShortFeedItems = (queryClient: QueryClient) => {
  return queryClient.getQueriesData<InfiniteData<RestTimelineFeedResponse>>({
    queryKey: [PAGINATED_QUERY_FEED],
  })
}

export const getCachedPaginatedShortFeedItem = (eventId: string, queryClient: QueryClient) => {
  const paginatedFeedItems = getCachedPaginatedShortFeedItems(queryClient)
  if (!paginatedFeedItems) return undefined
  return paginatedFeedItems.map(([queryKeys, store]) => [queryKeys, store?.pages.flatMap((page) => page.hits).find((event) => event.objectID === eventId)])
}

export const optimisticToggleSubscribe = async (subscribe: boolean, eventId: string, queryClient: QueryClient) => {
  const previousData = { shortFeedItems: getCachedPaginatedShortFeedItems(queryClient)! }

  const updateShortFeedItem = (oldShortFeedItemData: RestTimelineFeedItem): RestTimelineFeedItem => {
    if (!oldShortFeedItemData) return oldShortFeedItemData
    return { ...oldShortFeedItemData, user_registered_at: subscribe ? new Date().toISOString() : null }
  }
  const optimisticParams = { id: eventId, updater: updateShortFeedItem, queryClient }
  optmisticSetPaginatedShortFeedItem(optimisticParams)
  return previousData
}

export const optimisticFeedUpdate = async (payload: Partial<RestTimelineFeedItem>, eventId: string, queryClient: QueryClient) => {
  const previousData = { shortFeedItems: getCachedPaginatedShortFeedItems(queryClient)! }

  const updateShortFeedItem = (oldShortFeedItemData: RestTimelineFeedItem): RestTimelineFeedItem => {
    if (!oldShortFeedItemData) return oldShortFeedItemData
    return { ...oldShortFeedItemData, ...payload }
  }
  const optimisticParams = { id: eventId, updater: updateShortFeedItem, queryClient }
  optmisticSetPaginatedShortFeedItem(optimisticParams)
  return previousData
}
