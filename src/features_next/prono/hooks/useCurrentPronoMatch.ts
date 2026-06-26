import { useCurrentPronostic } from '@/services/pronostics/hook'

import { PronoMatchView } from '../model'
import { mapPronosticDataToMatch } from '../utils'

type UseCurrentPronoMatchResult = {
  match?: PronoMatchView
  isLoading: boolean
  isRefetching: boolean
  refetch: () => void
}

export function useCurrentPronoMatch(): UseCurrentPronoMatchResult {
  const { pronostic, isLoading, isRefetching, refetch } = useCurrentPronostic()

  return {
    match: pronostic ? mapPronosticDataToMatch(pronostic.data, pronostic.imageUrl) : undefined,
    isLoading,
    isRefetching,
    refetch,
  }
}
