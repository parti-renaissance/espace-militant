import { useCurrentPronostic } from '@/services/pronostics/hook'

import { PronoMatchView } from '../model'
import { mapPronosticDataToMatch } from '../utils'

type UseCurrentPronoMatchResult = {
  match?: PronoMatchView
  isLoading: boolean
}

export function useCurrentPronoMatch(): UseCurrentPronoMatchResult {
  const { pronostic, isLoading } = useCurrentPronostic()

  return {
    match: pronostic ? mapPronosticDataToMatch(pronostic.data, pronostic.imageUrl) : undefined,
    isLoading,
  }
}
