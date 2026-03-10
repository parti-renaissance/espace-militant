import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import * as api from '@/services/adherents/api'
import type { RestAdherentDetail, RestAdherentListItem } from '@/services/adherents/schema'

const DEFAULT_PAGE_SIZE = 25

export const ADHERENTS_QUERY_KEY = ['adherents'] as const
export const ADHERENT_DETAIL_QUERY_KEY = ['adherents', 'detail'] as const

/** Une seule page d'adhérents (pour navigation page par page) */
export const useAdherentsPage = (scope: string, page: number, pageSize: number = DEFAULT_PAGE_SIZE) => {
  return useQuery({
    queryKey: [...ADHERENTS_QUERY_KEY, scope, page, pageSize],
    queryFn: () => api.getAdherents({ scope, page, page_size: pageSize }),
    enabled: Boolean(scope) && page >= 1,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  })
}

export type UseAdherentDetailOptions = {
  /** Données de l’item liste pour affichage immédiat (UX fluide) avant chargement du détail complet */
  initialData?: RestAdherentListItem | null
}

/** Détail d’un adhérent. Passer `initialData` (item de la liste) pour afficher tout de suite les infos de base. */
export const useAdherentDetail = (uuid: string | undefined, scope: string | undefined, options?: UseAdherentDetailOptions) => {
  return useQuery<RestAdherentDetail>({
    queryKey: [...ADHERENT_DETAIL_QUERY_KEY, uuid, scope],
    queryFn: async () => api.getAdherentDetail(uuid!)({ scope: scope! }) as Promise<RestAdherentDetail>,
    enabled: Boolean(uuid && scope),
    placeholderData: (options?.initialData ?? undefined) as RestAdherentDetail | undefined,
    staleTime: 60 * 1000,
  })
}
