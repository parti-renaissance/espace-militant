import { useCallback, useEffect, useRef } from 'react'
import type { WebViewMessageEvent } from 'react-native-webview'
import { isWeb } from 'tamagui'

import useShareApi from '@/hooks/useShareApi'
import { useHits } from '@/services/hits/hook'

import { ALLOWED_ORIGINS, getToiPresidentShareUrl, TOI_PRESIDENT_SHARE_MESSAGE } from '../config/toiPresident'
import { parseToiPresidentMessage, stripBase64Prefix } from '../utils/toiPresidentMessages'

const SHARE_FILE_NAME = 'toi-president.png'
const DEFAULT_IMAGE_MIME = 'image/png'

const HIT_SOURCE_OPEN = 'toi_president_open'
const HIT_SOURCE_VOTE = 'toi_president_vote'
const HIT_SOURCE_SUBMISSION = 'toi_president_submission'
const HIT_SOURCE_SHARE = 'toi_president_share'

export function useToiPresidentBridge() {
  const { shareAsync } = useShareApi()
  const { trackClick, trackOpen } = useHits()
  const shareUrl = getToiPresidentShareUrl()

  const didTrackOpenRef = useRef(false)
  useEffect(() => {
    if (didTrackOpenRef.current) return
    didTrackOpenRef.current = true
    void trackOpen({ source: HIT_SOURCE_OPEN })
  }, [trackOpen])

  const handleMessage = useCallback(
    (raw: unknown) => {
      const message = parseToiPresidentMessage(raw)
      if (!message) return

      switch (message.type) {
        case 'VOTE':
          void trackClick({ source: HIT_SOURCE_VOTE, object_id: message.payload.idea_id, type: message.type, payload: message.payload })
          break
        case 'SUBMISSION':
          void trackClick({ source: HIT_SOURCE_SUBMISSION, object_id: message.payload.result.matched_person, type: message.type, payload: message.payload })
          break
        case 'SHARE_PROFILE':
          void trackClick({ source: HIT_SOURCE_SHARE, type: message.type, payload: { mimeType: message.payload.mimeType } })
          void shareAsync({
            url: shareUrl,
            message: TOI_PRESIDENT_SHARE_MESSAGE,
            file: {
              base64: stripBase64Prefix(message.payload.base64),
              mimeType: message.payload.mimeType,
              fileName: SHARE_FILE_NAME,
            },
          })
          break
        case 'share':
          void shareAsync({
            url: message.url ?? shareUrl,
            message: message.text,
            file: message.base64
              ? {
                  base64: stripBase64Prefix(message.base64),
                  mimeType: message.mimeType ?? DEFAULT_IMAGE_MIME,
                  fileName: message.fileName ?? SHARE_FILE_NAME,
                }
              : undefined,
          })
          break
      }
    },
    [shareAsync, trackClick, shareUrl],
  )

  useEffect(() => {
    if (!isWeb || typeof window === 'undefined') return
    const listener = (event: MessageEvent) => {
      if (!ALLOWED_ORIGINS.includes(event.origin)) return
      handleMessage(event.data)
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [handleMessage])

  const onWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      handleMessage(event.nativeEvent.data)
    },
    [handleMessage],
  )

  return { onWebViewMessage }
}
