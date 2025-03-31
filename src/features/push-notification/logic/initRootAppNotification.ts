import { Platform } from 'react-native'
import FB from '@/config/firebaseConfig'
import * as Notifications from 'expo-notifications'

export default () => {
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

  FB.messaging.setBackgroundMessageHandler((message) => {
    return new Promise<void>((resolve) => {
      console.log('Message handled in background', message)
      resolve()
    })
  })
}
