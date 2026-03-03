import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { isSupported } from '@firebase/messaging'

import FB from '@/config/firebaseConfig'

export default async function initRootAppNotification() {
  if (Platform.OS === 'web' && !(await isSupported())) {
    return
  }

  if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, // Show the alert while the app is in foreground
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
