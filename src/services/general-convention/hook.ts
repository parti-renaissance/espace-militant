import { useSuspenseQuery } from '@tanstack/react-query'
import * as api from './api'

export const useGetGeneralConventions = () => {
  return useSuspenseQuery({
    queryFn: () => api.getGeneralConventions(),
    queryKey: ['general-conventions'],
  })
}
