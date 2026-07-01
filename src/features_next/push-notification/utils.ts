import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { Href } from 'expo-router'
import { isSupported } from '@firebase/messaging'

import FB from '@/config/firebaseConfig'

export const parseHref = (x: unknown, source?: string): Href | null => {
  if (typeof x !== 'string') return null

  let href: string

  if (x.startsWith('/')) {
    href = x
  } else if (x.startsWith('https')) {
    try {
      const url = new URL(x)
      href = url.pathname + url.search
    } catch (e) {
      return null
    }
  } else {
    return null
  }

  if (source) {
    const separator = href.includes('?') ? '&' : '?'
    href = `${href}${separator}source=${encodeURIComponent(source)}`
  }

  return href as Href
}

export default async function initRootAppNotification() {
  if (Platform.OS === 'web' && !(await isSupported())) {
    return
  }

  if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })
  }

  if (!navigator.serviceWorker) {
    return
  }

  FB?.messaging.setBackgroundMessageHandler((message) => {
    return new Promise<void>((resolve) => {
      resolve()
    })
  })
}
