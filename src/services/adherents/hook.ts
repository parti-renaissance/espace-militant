import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import * as api from '@/services/adherents/api'
import type {
  RestAdherentDetail,
  RestAdherentDonation,
  RestAdherentListItem,
  RestAdherentSensitiveData,
} from '@/services/adherents/schema'

const DEFAULT_PAGE_SIZE = 25

export const ADHERENTS_QUERY_KEY = ['adherents'] as const
export const ADHERENT_DETAIL_QUERY_KEY = ['adherents', 'detail'] as const
export const ADHERENT_SENSITIVE_PHONE_QUERY_KEY = ['adherents', 'sensitive', 'phone'] as const
export const ADHERENT_SENSITIVE_EMAIL_QUERY_KEY = ['adherents', 'sensitive', 'email'] as const
export const ADHERENT_SENSITIVE_ADDRESS_QUERY_KEY = ['adherents', 'sensitive', 'address'] as const
export const ADHERENT_DONATIONS_QUERY_KEY = ['adherents', 'donations'] as const

export type UseAdherentsPageParams = {
  scope: string
  page: number
  pageSize?: number
  searchTerm?: string
  filters?: Record<string, unknown>
}

export const useAdherentsPage = ({ scope, page, pageSize = DEFAULT_PAGE_SIZE, searchTerm, filters = {} }: UseAdherentsPageParams) => {
  const search_term = searchTerm?.trim() || undefined
  return useQuery({
    queryKey: [...ADHERENTS_QUERY_KEY, scope, page, pageSize, search_term, filters],
    queryFn: () =>
      api.getAdherents({
        scope,
        page,
        page_size: pageSize,
        ...(search_term != null && { search_term }),
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
    queryKey: [...ADHERENT_DETAIL_QUERY_KEY, uuid],
    queryFn: async () => api.getAdherentDetail(uuid!)({ scope: scope! }) as Promise<RestAdherentDetail>,
    enabled: Boolean(uuid && scope),
    placeholderData: (options?.initialData ?? undefined) as RestAdherentDetail | undefined,
    staleTime: 60 * 1000,
  })
}

export const useAdherentPhone = (uuid: string | undefined, scope: string | undefined) => {
  return useQuery<RestAdherentSensitiveData>({
    queryKey: [...ADHERENT_SENSITIVE_PHONE_QUERY_KEY, uuid],
    queryFn: () => api.getAdherentSensitiveData(uuid!)({ scope: scope!, type: 'phone' }),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdherentEmail = (uuid: string | undefined, scope: string | undefined) => {
  return useQuery<RestAdherentSensitiveData>({
    queryKey: [...ADHERENT_SENSITIVE_EMAIL_QUERY_KEY, uuid],
    queryFn: () => api.getAdherentSensitiveData(uuid!)({ scope: scope!, type: 'email' }),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdherentAddress = (uuid: string | undefined, scope: string | undefined) => {
  return useQuery<RestAdherentSensitiveData>({
    queryKey: [...ADHERENT_SENSITIVE_ADDRESS_QUERY_KEY, uuid],
    queryFn: () => api.getAdherentSensitiveData(uuid!)({ scope: scope!, type: 'address' }),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdherentDonations = (uuid: string | undefined, scope: string | undefined) => {
  return useQuery<RestAdherentDonation[]>({
    queryKey: [...ADHERENT_DONATIONS_QUERY_KEY, uuid, scope],
    queryFn: () => api.getAdherentDonations(uuid!)({ scope: scope! }),
    enabled: Boolean(uuid && scope),
    staleTime: 60 * 1000,
  })
}
