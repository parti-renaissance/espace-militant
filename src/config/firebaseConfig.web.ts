import { isSupported } from '@firebase/messaging'
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { initializeApp } from 'firebase/app'
import * as wMessaging from 'firebase/messaging'
import { AuthorizationStatus } from './firebaseTypes'
import firebaseConfig from './firebaseWebConfig'

export { AuthorizationStatus }

// Initialize Firebase
type Mess = FirebaseMessagingTypes.Module

function initFirebase() {
  if (!navigator.serviceWorker) {
    // Service worker is not available on some browser private browsing or embedded mobile navigator.
    return
  }

  const app = initializeApp(firebaseConfig)

  

  const logNotImplemented = (x: string, payload?: unknown) => {
    if (__DEV__) console.warn('Firebase Web - not implemented', x, payload)
  }

  let Messaging: ReturnType<typeof wMessaging.getMessaging> | null = null

  try {
    Messaging = wMessaging.getMessaging(app)
  } catch (err) {
    if (__DEV__) {
      console.warn('Firebase Messaging not supported or failed to initialize:', err)
    }
    return null
  }

  return {
    messaging: {
      onMessage: (x: Parameters<Mess['onMessage']>[0]) => wMessaging.onMessage(Messaging, x as Parameters<typeof wMessaging.onMessage>[1]),
      getToken: () => wMessaging.getToken(Messaging),
      deleteToken: () => wMessaging.deleteToken(Messaging),
      unsubscribeFromTopic: (x: unknown) => logNotImplemented('unsubscribeFromTopic', x),
      subscribeToTopic: (x: unknown) => logNotImplemented('subscribeToTopic', x),
      setBackgroundMessageHandler: (x: unknown) => logNotImplemented('setBackgroundMessageHandler', x),
      requestPermission: async (_?: FirebaseMessagingTypes.IOSPermissions): Promise<AuthorizationStatus> => {
        if (!(await isSupported())) {
          return AuthorizationStatus.DENIED
        }

        const permission = await Notification.requestPermission()
        switch (permission) {
          case 'granted':
            return AuthorizationStatus.AUTHORIZED
          case 'denied':
            return AuthorizationStatus.DENIED
          default:
            return AuthorizationStatus.NOT_DETERMINED
        }
      },
      getInitialNotification: () =>
        new Promise((resolve) => {
          resolve(null)
          logNotImplemented('getInitialNotification')
        }),
      onNotificationOpenedApp: (x: Parameters<Mess['onNotificationOpenedApp']>[0]) => logNotImplemented('onNotificationOpenedApp', x),
    },

    app: {
      deviceId: app.options.appId,
    },
  }
}

const fb = initFirebase()

export default fb

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
