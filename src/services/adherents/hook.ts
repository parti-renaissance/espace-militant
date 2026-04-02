import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as api from '@/services/adherents/api'
import type {
  RestAdherentDetail,
  RestAdherentDonation,
  RestAdherentElectMandateUpsertPayload,
  RestAdherentElectMandateUpsertResponse,
  RestAdherentElectResponse,
  RestAdherentElectToggleExemptPayload,
  RestAdherentListItem,
  RestAdherentSensitiveData,
  RestAdherentSensitiveRequest,
} from '@/services/adherents/schema'

const DEFAULT_PAGE_SIZE = 25

const requireParam = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required parameter: ${name}`)
  }
  return value
}

export const adherentKeys = {
  all: ['adherents'] as const,
  list: (scope: string, page: number, pageSize: number, searchTerm: string | undefined, filters: Record<string, unknown>) =>
    [...adherentKeys.all, 'list', scope, page, pageSize, searchTerm, filters] as const,
  detail: (uuid: string | undefined) => [...adherentKeys.all, 'detail', uuid] as const,
  sensitive: (type: RestAdherentSensitiveRequest['type'], uuid: string | undefined) => [...adherentKeys.all, 'sensitive', type, uuid] as const,
  donations: (uuid: string | undefined, scope: string | undefined) => [...adherentKeys.all, 'donations', uuid, scope] as const,
  elect: (uuid: string | undefined, scope: string | undefined) => [...adherentKeys.all, 'elect', uuid, scope] as const,
}

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
    queryKey: adherentKeys.list(scope, page, pageSize, search_term, filters),
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
    networkMode: 'always',
  })
}

export type UseAdherentDetailOptions = {
  initialData?: RestAdherentListItem | null
}
export const useAdherentDetail = (uuid: string | undefined, scope: string | undefined, options?: UseAdherentDetailOptions) => {
  return useQuery<RestAdherentDetail>({
    queryKey: adherentKeys.detail(uuid),
    queryFn: async () => {
      const safeUuid = requireParam(uuid, 'uuid')
      const safeScope = requireParam(scope, 'scope')
      return api.getAdherentDetail(safeUuid)({ scope: safeScope }) as Promise<RestAdherentDetail>
    },
    enabled: Boolean(uuid && scope),
    placeholderData: (options?.initialData ?? undefined) as RestAdherentDetail | undefined,
    staleTime: 60 * 1000,
    networkMode: 'always',
  })
}

const useAdherentSensitiveData = (type: RestAdherentSensitiveRequest['type'], uuid: string | undefined, scope: string | undefined) => {
  return useQuery<RestAdherentSensitiveData>({
    queryKey: adherentKeys.sensitive(type, uuid),
    queryFn: () => {
      const safeUuid = requireParam(uuid, 'uuid')
      const safeScope = requireParam(scope, 'scope')
      return api.getAdherentSensitiveData(safeUuid)({ scope: safeScope, type })
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdherentPhone = (uuid: string | undefined, scope: string | undefined) => {
  return useAdherentSensitiveData('phone', uuid, scope)
}

export const useAdherentEmail = (uuid: string | undefined, scope: string | undefined) => {
  return useAdherentSensitiveData('email', uuid, scope)
}

export const useAdherentAddress = (uuid: string | undefined, scope: string | undefined) => {
  return useAdherentSensitiveData('address', uuid, scope)
}

export const useAdherentDonations = (uuid: string | undefined, scope: string | undefined) => {
  return useQuery<RestAdherentDonation[]>({
    queryKey: adherentKeys.donations(uuid, scope),
    queryFn: () => {
      const safeUuid = requireParam(uuid, 'uuid')
      const safeScope = requireParam(scope, 'scope')
      return api.getAdherentDonations(safeUuid)({ scope: safeScope })
    },
    enabled: Boolean(uuid && scope),
    staleTime: 60 * 1000,
  })
}

export const useAdherentElect = (uuid: string | undefined, scope: string | undefined, enabled?: boolean) => {
  return useQuery<RestAdherentElectResponse>({
    queryKey: adherentKeys.elect(uuid, scope),
    queryFn: () => {
      const safeUuid = requireParam(uuid, 'uuid')
      const safeScope = requireParam(scope, 'scope')
      return api.getAdherentElect(safeUuid)({ scope: safeScope })
    },
    enabled: Boolean(uuid && scope && enabled),
    staleTime: 60 * 1000,
  })
}

type UseMutationAdherentElectMandateParams = {
  adherentUuid?: string
  scope?: string
}

type CreateAdherentElectMandateVariables = {
  payload: RestAdherentElectMandateUpsertPayload
}

type UpdateAdherentElectMandateVariables = {
  mandateUuid: string
  payload: RestAdherentElectMandateUpsertPayload
}

type DeleteAdherentElectMandateVariables = {
  mandateUuid: string
}

type ToggleAdherentElectExemptFromCotisationVariables = RestAdherentElectToggleExemptPayload
type ToggleAdherentElectExemptFromCotisationContext = {
  previousElect?: RestAdherentElectResponse
  electKey: ReturnType<typeof adherentKeys.elect>
}

export const useMutationCreateAdherentElectMandate = ({ adherentUuid, scope }: UseMutationAdherentElectMandateParams) => {
  const queryClient = useQueryClient()
  return useMutation<RestAdherentElectMandateUpsertResponse, Error, CreateAdherentElectMandateVariables>({
    mutationFn: ({ payload }) => {
      const safeScope = requireParam(scope, 'scope')
      return api.postAdherentElectMandate({ scope: safeScope, payload })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adherentKeys.elect(adherentUuid, scope) })
    },
  })
}

export const useMutationUpdateAdherentElectMandate = ({ adherentUuid, scope }: UseMutationAdherentElectMandateParams) => {
  const queryClient = useQueryClient()
  return useMutation<RestAdherentElectMandateUpsertResponse, Error, UpdateAdherentElectMandateVariables>({
    mutationFn: ({ mandateUuid, payload }) => {
      const safeScope = requireParam(scope, 'scope')
      return api.putAdherentElectMandate({ mandateUuid, scope: safeScope, payload })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adherentKeys.elect(adherentUuid, scope) })
    },
  })
}

export const useMutationDeleteAdherentElectMandate = ({ adherentUuid, scope }: UseMutationAdherentElectMandateParams) => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, DeleteAdherentElectMandateVariables>({
    mutationFn: ({ mandateUuid }) => {
      const safeScope = requireParam(scope, 'scope')
      return api.deleteAdherentElectMandate({ mandateUuid, scope: safeScope })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adherentKeys.elect(adherentUuid, scope) })
    },
  })
}

export const useMutationToggleAdherentElectExemptFromCotisation = ({ adherentUuid, scope }: UseMutationAdherentElectMandateParams) => {
  const queryClient = useQueryClient()
  return useMutation<RestAdherentElectResponse, Error, ToggleAdherentElectExemptFromCotisationVariables, ToggleAdherentElectExemptFromCotisationContext>({
    onMutate: async (payload) => {
      const safeUuid = requireParam(adherentUuid, 'adherentUuid')
      const safeScope = requireParam(scope, 'scope')
      const electKey = adherentKeys.elect(safeUuid, safeScope)

      await queryClient.cancelQueries({ queryKey: electKey })
      const previousElect = queryClient.getQueryData<RestAdherentElectResponse>(electKey)

      if (previousElect) {
        queryClient.setQueryData<RestAdherentElectResponse>(electKey, {
          ...previousElect,
          exempt_from_cotisation: payload.exemptFromCotisation,
        })
      }

      return { previousElect, electKey }
    },
    mutationFn: (payload) => {
      const safeUuid = requireParam(adherentUuid, 'adherentUuid')
      const safeScope = requireParam(scope, 'scope')
      return api.putAdherentElectExemptFromCotisation({
        uuid: safeUuid,
        scope: safeScope,
        payload,
      })
    },
    onError: (_error, _variables, context) => {
      if (context?.previousElect && context?.electKey) {
        queryClient.setQueryData(context.electKey, context.previousElect)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adherentKeys.elect(adherentUuid, scope) })
    },
  })
}
