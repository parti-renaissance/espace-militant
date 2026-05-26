import { useEffect, useRef } from 'react'

type Params = {
  isAtBottom: boolean
  streamedContent: string
  messagesCount: number
  scrollFn: () => void
}

export function useAutoScrollOnStream({ isAtBottom, streamedContent, messagesCount, scrollFn }: Params) {
  const isAtBottomRef = useRef(isAtBottom)
  useEffect(() => {
    isAtBottomRef.current = isAtBottom
  }, [isAtBottom])

  useEffect(() => {
    if (!isAtBottomRef.current) return
    requestAnimationFrame(scrollFn)
  }, [streamedContent, messagesCount, scrollFn])
}
