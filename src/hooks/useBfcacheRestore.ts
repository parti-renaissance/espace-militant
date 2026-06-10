import { useEffect, useEffectEvent } from 'react'
import { Platform } from 'react-native'

export default function useBfcacheRestore(onRestore: () => void) {
  const onPageRestore = useEffectEvent(onRestore)

  useEffect(() => {
    if (Platform.OS !== 'web') return

    const controller = new AbortController()
    window.addEventListener(
      'pageshow',
      (event) => {
        if (event.persisted) {
          onPageRestore()
        }
      },
      { signal: controller.signal },
    )

    return () => controller.abort()
  }, [])
}
