import { InfiniteData, QueryClient } from '@tanstack/react-query'

import type { RestPagination } from '@/services/common/schema'

import { hubKeys, type HubItemsQueryScope } from './constants'
import type { HubItemsRequestParams } from './paramsMapper'
import type { RestHubItem } from './schema'

type HubQueryKey = readonly [
  (typeof hubKeys.all)[number],
  'items',
  HubItemsQueryScope,
  HubItemsRequestParams & { page?: number },
]

const isHubItemsQueryKey = (queryKey: readonly unknown[]): queryKey is HubQueryKey =>
  queryKey.length >= 4 && queryKey[0] === hubKeys.all[0] && queryKey[1] === 'items'

const getHubItemsParams = (queryKey: readonly unknown[]): (HubItemsRequestParams & { page?: number }) | undefined =>
  isHubItemsQueryKey(queryKey) ? queryKey[3] : undefined

type HubCachedData = InfiniteData<RestPagination<RestHubItem>> | RestPagination<RestHubItem>

export type HubQueriesSnapshot = ReturnType<typeof getCachedHubQueries>

export const getCachedHubQueries = (queryClient: QueryClient) =>
  queryClient.getQueriesData<HubCachedData>({ queryKey: hubKeys.all })

const isInfiniteHubData = (data: HubCachedData): data is InfiniteData<RestPagination<RestHubItem>> =>
  'pages' in data && Array.isArray(data.pages)

const isPaginatedHubData = (data: HubCachedData): data is RestPagination<RestHubItem> =>
  'items' in data && Array.isArray(data.items) && 'metadata' in data

export const restoreHubQueries = (queryClient: QueryClient, snapshot: HubQueriesSnapshot | undefined) => {
  snapshot?.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data)
  })
}

export const invalidateHubQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: hubKeys.all })
}

type PatchHubSubscriptionParams = {
  itemId: string
  itemType: RestHubItem['type']
  subscribe: boolean
}

const patchHubItem = (item: RestHubItem, subscribe: boolean): RestHubItem => ({
  ...item,
  user_registered_at: subscribe ? new Date().toISOString() : null,
  participants_count:
    item.participants_count != null ? item.participants_count + (subscribe ? 1 : -1) : item.participants_count,
})

const patchHubItems = (
  items: RestHubItem[],
  { itemId, itemType, subscribe }: PatchHubSubscriptionParams,
  isSubscribedOnlyFeed: boolean,
): RestHubItem[] => {
  if (isSubscribedOnlyFeed && !subscribe) {
    return items.filter((item) => item.uuid !== itemId)
  }

  const hasItem = items.some((item) => item.uuid === itemId && item.type === itemType)
  if (isSubscribedOnlyFeed && subscribe && !hasItem) {
    return items
  }

  return items.map((item) => {
    if (item.uuid !== itemId || item.type !== itemType) return item
    return patchHubItem(item, subscribe)
  })
}

export const patchHubSubscription = (queryClient: QueryClient, params: PatchHubSubscriptionParams) => {
  getCachedHubQueries(queryClient).forEach(([queryKey, old]) => {
    if (!old) return

    const hubParams = getHubItemsParams(queryKey)
    const isSubscribedOnlyFeed = hubParams?.subscribedOnly === true

    if (isInfiniteHubData(old)) {
      queryClient.setQueryData<InfiniteData<RestPagination<RestHubItem>>>(queryKey, {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: patchHubItems(page.items ?? [], params, isSubscribedOnlyFeed),
        })),
      })
      return
    }

    if (isPaginatedHubData(old)) {
      queryClient.setQueryData<RestPagination<RestHubItem>>(queryKey, {
        ...old,
        items: patchHubItems(old.items, params, isSubscribedOnlyFeed),
      })
    }
  })
}
