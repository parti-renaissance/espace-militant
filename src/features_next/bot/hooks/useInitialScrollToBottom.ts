import { useEffect, useRef } from 'react'

export function useInitialScrollToBottom(scrollFn: () => void, ready: boolean) {
  const doneRef = useRef(false)
  useEffect(() => {
    if (doneRef.current || !ready) return
    doneRef.current = true
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollFn)
    })
  }, [scrollFn, ready])
}
