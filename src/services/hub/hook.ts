import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'

import * as api from './api'
import { HUB_ITEMS_FEED_GC_TIME_MS, HUB_ITEMS_FEED_STALE_TIME_MS, HUB_ITEMS_SNAPSHOT_GC_TIME_MS, HUB_ITEMS_SNAPSHOT_STALE_TIME_MS, hubKeys } from './constants'
import type { GetHubItemsParametersMapperProps, HubItemsRequestParams } from './paramsMapper'
import type { RestGetHubItemsResponse } from './schema'

export type { HubItemsRequestParams } from './paramsMapper'

const getNextPageParam = (lastPage: RestGetHubItemsResponse | undefined) =>
  lastPage && lastPage.metadata.last_page > lastPage.metadata.current_page ? lastPage.metadata.current_page + 1 : null

const pinnedHubItemsQueryParams = { pinned: true, upcomingOnly: true } as const satisfies HubItemsRequestParams

export const hubItemsInfiniteQueryOptions = (params: HubItemsRequestParams) =>
  infiniteQueryOptions({
    queryKey: hubKeys.items(params),
    queryFn: ({ pageParam }) => api.getHubItems({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: HUB_ITEMS_FEED_STALE_TIME_MS,
    gcTime: HUB_ITEMS_FEED_GC_TIME_MS,
    refetchOnMount: true,
  })

export const hubItemsQueryOptions = (params: GetHubItemsParametersMapperProps) =>
  queryOptions({
    queryKey: hubKeys.items(params),
    queryFn: () => api.getHubItems(params),
    staleTime: HUB_ITEMS_SNAPSHOT_STALE_TIME_MS,
    gcTime: HUB_ITEMS_SNAPSHOT_GC_TIME_MS,
  })

export const useHubItemsInfiniteQuery = (opts: { params: HubItemsRequestParams; enabled?: boolean }) => {
  const { params, enabled = true } = opts

  return useInfiniteQuery({
    ...hubItemsInfiniteQueryOptions(params),
    enabled,
  })
}

export const usePinnedHubItemsInfiniteQuery = (opts?: { enabled?: boolean }) => {
  const { enabled = true } = opts ?? {}

  return useInfiniteQuery({
    ...hubItemsInfiniteQueryOptions(pinnedHubItemsQueryParams),
    enabled,
  })
}

export const usePinnedHubItemsSuspenseInfiniteQuery = () => useSuspenseInfiniteQuery(hubItemsInfiniteQueryOptions(pinnedHubItemsQueryParams))

export const useHubItemsQuery = (opts: { params: GetHubItemsParametersMapperProps; enabled?: boolean }) => {
  const { params, enabled = true } = opts

  return useQuery({
    ...hubItemsQueryOptions(params),
    enabled,
  })
}

export { hubKeys, FRANCE_METRO_HUB_BBOX } from './constants'
