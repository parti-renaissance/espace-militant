import { getTimelineFeed } from '@/services/timeline-feed/api'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

export const PAGINATED_QUERY_FEED = 'feed' as const

const fetchTimelineFeed = async (page: number) => await getTimelineFeed({ page })

export const useGetPaginatedFeed = () => {
  return useSuspenseInfiniteQuery({
    queryKey: [PAGINATED_QUERY_FEED],
    queryFn: ({ pageParam }) => fetchTimelineFeed(pageParam),
    getNextPageParam: (lastPage) => (lastPage ? (lastPage.nbPages > lastPage.page ? lastPage.page + 1 : null) : null),
    getPreviousPageParam: (firstPage) => (firstPage ? firstPage.page - 1 : null),
    initialPageParam: 0,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
