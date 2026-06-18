import { useCallback, useEffect, useRef } from 'react'
import type { WebViewMessageEvent } from 'react-native-webview'

import { useWindowMessage } from '@/features_next/ideas/pages/toi-president/hooks/useWindowMessage'

import useShareApi from '@/hooks/useShareApi'
import { HIT_SOURCES } from '@/services/hits/constants'
import { useHits } from '@/services/hits/hook'

import { ALLOWED_ORIGINS, getToiPresidentShareUrl } from '../config'
import { parseToiPresidentMessage } from '../utils'
import { dispatchMessage } from './useToiPresidentMessages/registry'

export function useToiPresidentMessages() {
  const { shareAsync } = useShareApi()
  const { trackClick, trackOpen } = useHits()
  const shareUrl = getToiPresidentShareUrl()

  const didTrackOpenRef = useRef(false)
  useEffect(() => {
    if (didTrackOpenRef.current) return
    didTrackOpenRef.current = true
    void trackOpen({ source: HIT_SOURCES.TOI_PRESIDENT })
  }, [trackOpen])

  const handleMessage = useCallback(
    (raw: string) => {
      const message = parseToiPresidentMessage(raw)
      if (!message) return
      dispatchMessage(message, { trackClick, shareAsync, shareUrl })
    },
    [shareAsync, trackClick, shareUrl],
  )

  useWindowMessage(handleMessage, ALLOWED_ORIGINS)

  const onWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      handleMessage(event.nativeEvent.data)
    },
    [handleMessage],
  )

  return { onWebViewMessage }
}
