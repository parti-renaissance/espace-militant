import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import * as api from '@/services/adherents/api'
import type { RestAdherentDetail, RestAdherentListItem } from '@/services/adherents/schema'

const DEFAULT_PAGE_SIZE = 25

export const ADHERENTS_QUERY_KEY = ['adherents'] as const
export const ADHERENT_DETAIL_QUERY_KEY = ['adherents', 'detail'] as const

export type UseAdherentsPageParams = {
  scope: string
  page: number
  pageSize?: number
  filters?: Record<string, unknown>
}

export const useAdherentsPage = ({ scope, page, pageSize = DEFAULT_PAGE_SIZE, filters = {} }: UseAdherentsPageParams) => {
  return useQuery({
    queryKey: [...ADHERENTS_QUERY_KEY, scope, page, pageSize, filters],
    queryFn: () =>
      api.getAdherents({
        scope,
        page,
        page_size: pageSize,
        ...filters,
      }),
    enabled: Boolean(scope) && page >= 1,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  })
}

export type UseAdherentDetailOptions = {
  initialData?: RestAdherentListItem | null
}
export const useAdherentDetail = (uuid: string | undefined, scope: string | undefined, options?: UseAdherentDetailOptions) => {
  return useQuery<RestAdherentDetail>({
    queryKey: [...ADHERENT_DETAIL_QUERY_KEY, uuid, scope],
    queryFn: async () => api.getAdherentDetail(uuid!)({ scope: scope! }) as Promise<RestAdherentDetail>,
    enabled: Boolean(uuid && scope),
    placeholderData: (options?.initialData ?? undefined) as RestAdherentDetail | undefined,
    staleTime: 60 * 1000,
  })
}
