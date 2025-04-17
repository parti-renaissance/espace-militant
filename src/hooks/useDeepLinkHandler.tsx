import { useEffect } from 'react'
import { Platform } from 'react-native'
import * as Linking from 'expo-linking'
import { router, usePathname } from 'expo-router'

/**
 * Used to handle universal link while app is open (in foreground or background),
 * because Expo Router does not handle this (misconfiguration or native behavior)
 */
export default function useDeepLinkHandler() {
  const pathname = usePathname()

  useEffect(() => {
    if (Platform.OS === 'web') return

    const onDeepLink: Linking.URLListener = ({ url }) => {
      const path = Linking.parse(url)?.path
      // Don't route if already on the requested page
      if (path && pathname !== path) {
        router.push(`/${path}`)
      }
    }

    const subscription = Linking.addEventListener('url', onDeepLink)

    return () => {
      subscription.remove()
    }
  }, [pathname])
}
