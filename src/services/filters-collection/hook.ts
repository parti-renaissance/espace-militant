import { useQuery } from '@tanstack/react-query'

import * as api from '@/services/filters-collection/api'

const FILTERS_COLLECTION_QUERY_KEY = ['filters-collection'] as const

export type UseGetFiltersCollectionParams = {
  featureKey: string
  scope?: string
  enabled?: boolean
}

export const useGetFiltersCollection = ({ featureKey, scope, enabled = true }: UseGetFiltersCollectionParams) => {
  return useQuery({
    queryKey: [...FILTERS_COLLECTION_QUERY_KEY, featureKey, scope],
    queryFn: () => api.getFiltersCollection({ feature: featureKey, scope }),
    enabled: Boolean(featureKey) && (enabled !== false),
    staleTime: (query) => (query.state.error ? 0 : 60 * 1000),
  })
}
