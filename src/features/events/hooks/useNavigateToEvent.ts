import { useCallback } from 'react'
import { Href, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

import { useSession } from '@/ctx/SessionProvider'
import { prefetchEventQuery, seedEventQuery } from '@/services/events/helpers'
import type { RestEvent } from '@/services/events/schema'

export const useNavigateToEvent = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { session } = useSession()

  return useCallback(
    (slug: string, seed?: RestEvent | null, options?: { source?: string }) => {
      if (seed) {
        seedEventQuery(queryClient, slug, seed)
      }
      void prefetchEventQuery(queryClient, slug, { isAuthenticated: Boolean(session) })
      const sourceQuery = options?.source ? `?source=${encodeURIComponent(options.source)}` : ''
      router.push(`/evenements/${slug}${sourceQuery}` as Href)
    },
    [queryClient, router, session],
  )
}
