import { useCallback } from 'react'
import { useRouter } from 'expo-router'

import { useShareOrCopy } from '@/hooks/useShareOrCopy'

import { getToiPresidentShareUrl, TOI_PRESIDENT_SHARE_MESSAGE } from '../config'

export function useToiPresidentActions() {
  const router = useRouter()
  const { handleShareOrCopy } = useShareOrCopy()

  const play = useCallback(() => {
    router.push('/idees/toi-president')
  }, [router])

  const share = useCallback(() => {
    handleShareOrCopy({ url: getToiPresidentShareUrl(), message: TOI_PRESIDENT_SHARE_MESSAGE })
  }, [handleShareOrCopy])

  return { play, share }
}
