import { QueryClient } from '@tanstack/react-query'

import * as api from './api'
import { QUERY_KEY_ACTION } from './hook'
import type { RestActionFull } from './schema'

export const SEEDED_ACTION_KEY = '_isSeeded' as const

export type SeededRestActionFull = RestActionFull & { [SEEDED_ACTION_KEY]?: true }

export const markActionAsSeeded = (action: RestActionFull): SeededRestActionFull => ({
  ...action,
  [SEEDED_ACTION_KEY]: true,
})

export const isSeededAction = (action: RestActionFull): action is SeededRestActionFull =>
  SEEDED_ACTION_KEY in action && action[SEEDED_ACTION_KEY as keyof typeof action] === true

export const seedActionQuery = (queryClient: QueryClient, id: string, seed: RestActionFull) => {
  queryClient.setQueryData([QUERY_KEY_ACTION, id], markActionAsSeeded(seed))
  queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ACTION, id] })
}

export const prefetchActionQuery = (queryClient: QueryClient, id: string) =>
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_ACTION, id],
    queryFn: () => api.getAction({ id }),
  })
