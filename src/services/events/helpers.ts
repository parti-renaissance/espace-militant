import { QueryClient } from '@tanstack/react-query'

import * as api from './api'
import { QUERY_KEY_SINGLE_EVENT } from './hook/queryKeys'
import type { RestEvent } from './schema'

export const getEventQueryCache = (queryClient: QueryClient, slug: string) =>
  queryClient.getQueryData<RestEvent>([QUERY_KEY_SINGLE_EVENT, slug])

export const seedEventQuery = (queryClient: QueryClient, slug: string, seed: RestEvent) => {
  if (getEventQueryCache(queryClient, slug)) {
    return
  }

  queryClient.setQueryData([QUERY_KEY_SINGLE_EVENT, slug], seed)
  queryClient.invalidateQueries({ queryKey: [QUERY_KEY_SINGLE_EVENT, slug] })
}

export const prefetchEventQuery = (queryClient: QueryClient, slug: string, options: { isAuthenticated: boolean }) =>
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_SINGLE_EVENT, slug],
    queryFn: () => (options.isAuthenticated ? api.getEventDetails(slug) : api.getPublicEventDetails(slug)),
  })
