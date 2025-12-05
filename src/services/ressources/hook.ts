import { useInfiniteQuery } from '@tanstack/react-query'
import * as api from './api'
import { RestGetRessourcesResponse } from './schema'

const QUERY_KEY = ['ressources']

const queryFn = ({ pageParam = 1 }: { pageParam: number }) => api.getRessources({ page: pageParam })

const getNextPageParam = (lastPage: RestGetRessourcesResponse) =>
  lastPage.metadata.current_page < lastPage.metadata.last_page
    ? lastPage.metadata.current_page + 1
    : undefined

export const useGetRessources = () => {
  return useInfiniteQuery({
    queryKey: QUERY_KEY,
    initialPageParam: 1,
    queryFn,
    getNextPageParam,
  })
}
