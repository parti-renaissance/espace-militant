import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { useSession } from '@/ctx/SessionProvider'
import { getPublicTimelineFeed, getTimelineFeed } from '@/services/timeline-feed/api'

export const PAGINATED_QUERY_FEED = 'feed' as const

const fetchTimelineFeed = async (page: number) => await getTimelineFeed({ page })
const fetchPublicTimelineFeed = async (page: number) => await getPublicTimelineFeed({ page })

const getPaginatedFeedInfiniteQueryOptions = (isAuth: boolean) => ({
  queryKey: [PAGINATED_QUERY_FEED, isAuth ? 'private' : 'public'] as const,
  queryFn: ({ pageParam }: { pageParam: number }) => (isAuth ? fetchTimelineFeed(pageParam) : fetchPublicTimelineFeed(pageParam)),
  getNextPageParam: (lastPage: Awaited<ReturnType<typeof fetchTimelineFeed>> | undefined) =>
    lastPage ? (lastPage.nbPages > lastPage.page ? lastPage.page + 1 : null) : null,
  getPreviousPageParam: (firstPage: Awaited<ReturnType<typeof fetchTimelineFeed>> | undefined) => (firstPage ? firstPage.page - 1 : null),
  initialPageParam: 0,
  refetchOnMount: true,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
})

export const useGetPaginatedFeed = () => {
  const { isAuth } = useSession()
  return useSuspenseInfiniteQuery(getPaginatedFeedInfiniteQueryOptions(isAuth))
}
