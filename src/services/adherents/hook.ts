import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import * as api from '@/services/adherents/api'

const DEFAULT_PAGE_SIZE = 25

export const usePaginatedAdherents = (scope: string, pageSize: number = DEFAULT_PAGE_SIZE) => {
  return useInfiniteQuery({
    queryKey: ['adherents', scope, pageSize],
    queryFn: ({ pageParam = 1 }) => api.getAdherents({ scope, page: pageParam, page_size: pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.last_page ? lastPage.metadata.current_page + 1 : undefined,
    getPreviousPageParam: (firstPage) => (firstPage.metadata.current_page > 1 ? firstPage.metadata.current_page - 1 : undefined),
    placeholderData: (prev) => prev,
    refetchOnMount: true,
    staleTime: 60 * 1000,
  })
}

/** Une seule page d’adhérents (pour navigation page par page) */
export const useAdherentsPage = (scope: string, page: number, pageSize: number = DEFAULT_PAGE_SIZE) => {
  return useQuery({
    queryKey: ['adherents', scope, page, pageSize],
    queryFn: () => api.getAdherents({ scope, page, page_size: pageSize }),
    enabled: Boolean(scope) && page >= 1,
    staleTime: 60 * 1000,
  })
}
