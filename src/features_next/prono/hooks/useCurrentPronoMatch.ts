import { PRONO_FALLBACK_MATCH, PronoMatchView } from '../model'

type UseCurrentPronoMatchResult = {
  match: PronoMatchView
  isLoading: boolean
}

export function useCurrentPronoMatch(): UseCurrentPronoMatchResult {
  return {
    match: PRONO_FALLBACK_MATCH,
    isLoading: false,
  }
}
