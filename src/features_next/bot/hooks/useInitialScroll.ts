import { useEffect, useRef } from 'react'

/** Appelle `scrollFn` une seule fois, dès que `ready` devient `true`, après deux frames d'attente. */
export function useInitialScroll(scrollFn: () => void, ready: boolean) {
  const doneRef = useRef(false)
  useEffect(() => {
    if (doneRef.current || !ready) return
    doneRef.current = true
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollFn)
    })
  }, [scrollFn, ready])
}
