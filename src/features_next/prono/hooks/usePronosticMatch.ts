import { usePronostic } from '@/services/pronostics/hook'

import { PronoMatchView } from '../model'
import { mapPronosticDataToMatch } from '../utils'

export function usePronosticMatch(uuid: string): { match: PronoMatchView } {
  const { data } = usePronostic(uuid)

  return {
    match: mapPronosticDataToMatch(data),
  }
}
