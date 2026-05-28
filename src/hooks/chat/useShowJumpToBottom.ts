import { useCallback, useEffect, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { isWeb } from 'tamagui'

const HIDE_DISTANCE_PX = 300

type Args = {
  lastMessageId: string | null
  webDomIdPrefix?: string
}

export function useShowJumpToBottom({ lastMessageId, webDomIdPrefix = 'chat-msg-' }: Args) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isWeb) return
    if (!lastMessageId) {
      setShow(false)
      return
    }

    let observer: IntersectionObserver | null = null
    let frame = 0

    const attach = () => {
      const el = document.getElementById(`${webDomIdPrefix}${lastMessageId}`)
      if (!el) {
        frame = requestAnimationFrame(attach)
        return
      }
      observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { threshold: 0 })
      observer.observe(el)
    }
    attach()

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [lastMessageId, webDomIdPrefix])

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isWeb) return
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    const distance = contentSize.height - contentOffset.y - layoutMeasurement.height
    setShow(distance > HIDE_DISTANCE_PX)
  }, [])

  return { show, handleScroll }
}
