import { usePronostic } from '@/services/pronostics/hook'

import { PronoMatchView } from '../model'
import { mapPronosticDataToMatch } from '../utils'

type UsePronosticMatchResult = {
  match: PronoMatchView
  isRefetching: boolean
  refetch: () => void
}

export function usePronosticMatch(uuid: string): UsePronosticMatchResult {
  const { data, isRefetching, refetch } = usePronostic(uuid)

  return {
    match: mapPronosticDataToMatch(data),
    isRefetching,
    refetch,
  }
}
