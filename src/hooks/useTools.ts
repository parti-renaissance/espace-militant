import { useMemo } from 'react'
import ApiService from '@/data/network/ApiService'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

const key = ['tools']

const fetchTools = async (page: number) => {
  return ApiService.getInstance().getTools(page)
}

// Stable functions outside the component to prevent recreation
const queryFn = ({ pageParam }: { pageParam: number }) => fetchTools(pageParam)
const getNextPageParam = (lastPage: any) => lastPage.metadata.current_page + 1

export const useTools = () => {
  return useSuspenseInfiniteQuery({
    queryKey: key,
    initialPageParam: 1,
    queryFn,
    getNextPageParam,
  })
}
