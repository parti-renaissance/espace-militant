import { PermissionsAndroid, Platform } from 'react-native'
import Constants from 'expo-constants'

// --- RN Firebase (native) ---
import {
  getApps as getNativeApps,
  getApp as getNativeApp,
  initializeApp as initNativeApp,
} from '@react-native-firebase/app'
import {
  getMessaging as getNativeMessaging,
  onMessage as onNativeMessage,
  getToken as getNativeToken,
  deleteToken as deleteNativeToken,
  subscribeToTopic as nativeSubscribeToTopic,
  unsubscribeFromTopic as nativeUnsubscribeFromTopic,
  setBackgroundMessageHandler as setNativeBackgroundMessageHandler,
  getInitialNotification as getNativeInitialNotification,
  onNotificationOpenedApp as onNativeNotificationOpenedApp,
  requestPermission as nativeRequestPermission,
} from '@react-native-firebase/messaging'
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

// --- Firebase Web ---
import { initializeApp as initWebApp, getApps as getWebApps } from 'firebase/app'
import {
  getMessaging as getWebMessaging,
  onMessage as onWebMessage,
  getToken as getWebToken,
  deleteToken as deleteWebToken,
} from 'firebase/messaging'

import { AuthorizationStatus } from './firebaseTypes'
import firebaseWebConfig from './firebaseWebConfig'
import firebaseConfig from './firebaseWebConfig'

export { AuthorizationStatus }

type Unsubscribe = () => void

// Détection plus fiable du runtime “web” (Storybook/Expo web/Next)
const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined'

function ensureWebApp() {
  if (getWebApps().length === 0) {
    initWebApp(firebaseWebConfig)
  }
}

function tryEnsureNativeApp(): boolean {
  // Si des fichiers natifs sont présents, RNFB peut initialiser sans options
  try {
    if (getNativeApps().length === 0) {
      initNativeApp(firebaseConfig)
    }
    return getNativeApps().length > 0
  } catch {
    // Dans un bundle web/Storybook, l’init native n’est pas possible
    return false
  }
}

function initFirebase() {
  // 1) Si on est dans un environnement “web” (SB web/Expo web), on prend le chemin web.
  if (isBrowser) {
    ensureWebApp()
    const m = (() => {
      try {
        return getWebMessaging()
      } catch {
        return null
      }
    })()

    return {
      messaging: {
        onMessage: (listener: (msg: unknown) => void): Unsubscribe =>
          m ? onWebMessage(m, listener as any) : () => {},

        getToken: async () => (m ? getWebToken(m) : null),

        deleteToken: async () => {
          if (m) return deleteWebToken(m)
        },

        // Non supporté côté main thread web (topics = côté serveur)
        subscribeToTopic: async () => {},
        unsubscribeFromTopic: async () => {},
        setBackgroundMessageHandler: async () => {}, // via SW sur web
        getInitialNotification: async () => null,
        onNotificationOpenedApp: () => () => {},

        requestPermission: async () => {
          if ('Notification' in globalThis && Notification.requestPermission) {
            const res = await Notification.requestPermission()
            return res === 'granted'
              ? AuthorizationStatus.AUTHORIZED
              : res === 'denied'
                ? AuthorizationStatus.DENIED
                : AuthorizationStatus.NOT_DETERMINED
          }
          return AuthorizationStatus.NOT_DETERMINED
        },
      },

      app: { deviceId: Constants.sessionId },
    }
  }

  // 2) Sinon, on tente le chemin natif uniquement s’il y a (ou on peut créer) une app RNFB.
  const hasNative = tryEnsureNativeApp()
  if (hasNative) {
    const app = getNativeApp()
    const m = getNativeMessaging(app)

    return {
      messaging: {
        onMessage: (listener: (message: FirebaseMessagingTypes.RemoteMessage) => void): Unsubscribe =>
          onNativeMessage(m, listener),

        getToken: () => getNativeToken(m),

        deleteToken: () => deleteNativeToken(m),

        subscribeToTopic: (topic: string) => nativeSubscribeToTopic(m, topic),

        unsubscribeFromTopic: (topic: string) =>
          nativeUnsubscribeFromTopic(m, topic),

        setBackgroundMessageHandler: (
          handler: (message: FirebaseMessagingTypes.RemoteMessage) => Promise<any>
        ) => setNativeBackgroundMessageHandler(m, handler),

        getInitialNotification: () => getNativeInitialNotification(m),

        onNotificationOpenedApp: (
          listener: (message: FirebaseMessagingTypes.RemoteMessage) => void
        ): Unsubscribe => onNativeNotificationOpenedApp(m, listener),

        requestPermission: async (
          ...args: Parameters<typeof nativeRequestPermission>
        ) => {
          if (Platform.OS === 'android') {
            const res = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            )
            return res === PermissionsAndroid.RESULTS.GRANTED
              ? AuthorizationStatus.AUTHORIZED
              : AuthorizationStatus.DENIED
          }
          return nativeRequestPermission(m)
        },
      },

      app: { deviceId: Constants.sessionId },
    }
  }

  // 3) Fallback “no-op” (ex. tests Node sans DOM et sans app native)
  return {
    messaging: {
      onMessage: () => () => {},
      getToken: async () => null,
      deleteToken: async () => {},
      subscribeToTopic: async () => {},
      unsubscribeFromTopic: async () => {},
      setBackgroundMessageHandler: async () => {},
      getInitialNotification: async () => null,
      onNotificationOpenedApp: () => () => {},
      requestPermission: async () => AuthorizationStatus.NOT_DETERMINED,
    },
    app: { deviceId: Constants.sessionId },
  }
}

const fb = initFirebase()
export default fb

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
