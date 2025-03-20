import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import * as api from './api'

export const useGetGeneralConventions = () => {
  return useSuspenseQuery({
    queryFn: () => api.getGeneralConventions(),
    queryKey: ['general-conventions'],
  })
}

export const useGetGeneralConvention = (uuid: string) => {
  return useMutation({
    mutationFn: () => api.getGeneralConvention(uuid),
    mutationKey: ['general-conventions', uuid],
  })
}
