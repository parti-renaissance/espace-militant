import { useEffect, useRef } from 'react'

export function useInitialScroll(scrollFn: () => void, ready: boolean) {
  const doneRef = useRef(false)
  useEffect(() => {
    if (doneRef.current || !ready) return
    doneRef.current = true
    const timer = setTimeout(scrollFn, 500)
    return () => clearTimeout(timer)
  }, [scrollFn, ready])
}
