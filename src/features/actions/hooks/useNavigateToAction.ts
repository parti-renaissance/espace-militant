import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

import { prefetchActionQuery, seedActionQuery } from '@/services/actions/helpers'
import type { RestActionFull } from '@/services/actions/schema'

export const useNavigateToAction = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useCallback(
    (id: string, seed?: RestActionFull | null) => {
      if (seed) {
        seedActionQuery(queryClient, id, seed)
      }
      void prefetchActionQuery(queryClient, id)
      router.push({ pathname: '/actions/[id]', params: { id } })
    },
    [queryClient, router],
  )
}
