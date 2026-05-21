import { useQuery } from '@tanstack/react-query'

import * as api from './api'

export const videoKeys = {
  all: ['videos'] as const,
  detail: (uuid: string | undefined) => [...videoKeys.all, 'detail', uuid] as const,
}

const requireUuid = (uuid: string | undefined): string => {
  if (!uuid) {
    throw new Error('Missing required parameter: uuid')
  }
  return uuid
}

export const useVideo = (uuid: string | undefined, options?: { enabled?: boolean }) => {
  const enabled = Boolean(uuid) && (options?.enabled ?? true)

  return useQuery({
    queryKey: videoKeys.detail(uuid),
    queryFn: () => api.getVideo(requireUuid(uuid)),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
