import { useSuspenseQuery } from '@tanstack/react-query'
import * as api from './api'

export const useGetGeneralConventions = (enabled: boolean) => {
  if (!enabled) {
    return { data: null }
  }

  return useSuspenseQuery({
    queryFn: () => api.getGeneralConventions(),
    queryKey: ['general-conventions'],
  })
}

export const useGetGeneralConvention = (uuid: string, enabled: boolean) => {
  if (!enabled) {
    return { data: null }
  }

  return useSuspenseQuery({
    queryFn: () => api.getGeneralConvention(uuid),
    queryKey: ['general-conventions', uuid],
  })
}
