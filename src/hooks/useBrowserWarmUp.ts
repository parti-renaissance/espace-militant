import { useEffect } from 'react'
import { Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'

const useBrowserWarmUp = () => {
  if (Platform.OS === 'web') return
  useEffect(() => {
    void WebBrowser.warmUpAsync().catch(() => {
      // Ignore warmup failures; browser flow can still proceed.
    })
    return () => {
      void WebBrowser.coolDownAsync().catch(() => {
        // Ignore cooldown failures during teardown.
      })
    }
  }, [])
}

export default useBrowserWarmUp
