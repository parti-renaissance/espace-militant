import { startTransition, useEffect, useState } from 'react'

/**
 * Returns `true` once the critical initial render is done.
 * Use to defer non-essential components and avoid blocking the UI.
 */
export function useDeferredRender() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setIsReady(true)
    })
  }, [])

  return isReady
}
