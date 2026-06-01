import { useEffect } from 'react'
import { isWeb } from 'tamagui'

export function useWindowMessage(handler: (data: string) => void, allowedOrigins: string[]) {
  useEffect(() => {
    if (!isWeb || typeof window === 'undefined') return
    const listener = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) return
      handler(event.data)
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [handler, allowedOrigins])
}
