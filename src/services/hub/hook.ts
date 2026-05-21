import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { useSession } from '@/ctx/SessionProvider'

import * as api from './api'
import {
  HUB_ITEMS_FEED_GC_TIME_MS,
  HUB_ITEMS_FEED_STALE_TIME_MS,
  HUB_ITEMS_SNAPSHOT_GC_TIME_MS,
  HUB_ITEMS_SNAPSHOT_STALE_TIME_MS,
  hubKeys,
  type HubItemsQueryScope,
} from './constants'
import type { GetHubItemsParametersMapperProps, HubItemsRequestParams } from './paramsMapper'
import type { RestGetHubItemsResponse } from './schema'

export type { HubItemsRequestParams } from './paramsMapper'

const getNextPageParam = (lastPage: RestGetHubItemsResponse | undefined) =>
  lastPage && lastPage.metadata.last_page > lastPage.metadata.current_page ? lastPage.metadata.current_page + 1 : null

const pinnedHubItemsQueryParams = { pinned: true, upcomingOnly: true } as const satisfies HubItemsRequestParams

const fetchHubItems = (page: number, params: GetHubItemsParametersMapperProps, scope: HubItemsQueryScope) =>
  scope === 'private' ? api.getHubItems({ ...params, page }) : api.getPublicHubItems({ ...params, page })

export const hubItemsInfiniteQueryOptions = (params: HubItemsRequestParams, scope: HubItemsQueryScope) =>
  infiniteQueryOptions({
    queryKey: hubKeys.items(params, scope),
    queryFn: ({ pageParam }) => fetchHubItems(pageParam, { ...params, page: pageParam }, scope),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: HUB_ITEMS_FEED_STALE_TIME_MS,
    gcTime: HUB_ITEMS_FEED_GC_TIME_MS,
    refetchOnMount: true,
  })

export const hubItemsQueryOptions = (params: GetHubItemsParametersMapperProps, scope: HubItemsQueryScope) =>
  queryOptions({
    queryKey: hubKeys.items(params, scope),
    queryFn: () => fetchHubItems(params.page, params, scope),
    staleTime: HUB_ITEMS_SNAPSHOT_STALE_TIME_MS,
    gcTime: HUB_ITEMS_SNAPSHOT_GC_TIME_MS,
  })

export const useHubItemsInfiniteQuery = (opts: { params: HubItemsRequestParams; enabled?: boolean }) => {
  const { isAuth } = useSession()
  const { params, enabled = true } = opts
  const scope: HubItemsQueryScope = isAuth ? 'private' : 'public'

  return useInfiniteQuery({
    ...hubItemsInfiniteQueryOptions(params, scope),
    enabled,
  })
}

export const usePinnedHubItemsInfiniteQuery = (opts?: { enabled?: boolean }) => {
  const { isAuth } = useSession()
  const { enabled = true } = opts ?? {}
  const scope: HubItemsQueryScope = isAuth ? 'private' : 'public'

  return useInfiniteQuery({
    ...hubItemsInfiniteQueryOptions(pinnedHubItemsQueryParams, scope),
    enabled,
  })
}

export const usePinnedHubItemsSuspenseInfiniteQuery = () => {
  const { isAuth } = useSession()
  const scope: HubItemsQueryScope = isAuth ? 'private' : 'public'

  return useSuspenseInfiniteQuery(hubItemsInfiniteQueryOptions(pinnedHubItemsQueryParams, scope))
}

export const useHubItemsQuery = (opts: { params: GetHubItemsParametersMapperProps; enabled?: boolean }) => {
  const { isAuth } = useSession()
  const { params, enabled = true } = opts
  const scope: HubItemsQueryScope = isAuth ? 'private' : 'public'

  return useQuery({
    ...hubItemsQueryOptions(params, scope),
    enabled,
  })
}

export { hubKeys, FRANCE_METRO_HUB_BBOX } from './constants'
