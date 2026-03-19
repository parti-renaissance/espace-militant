import { useEffect } from 'react'
import { Platform } from 'react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { useToastController } from '@tamagui/toast'

import FB from '@/config/firebaseConfig'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

import { parseHref } from '../utils'

export const useInitPushNotification = () => {
  const toast = useToastController()

  useEffect(() => {
    let isMounted = true
    let expoNotificationSubscription: Notifications.Subscription | null = null
    let fbNotificationSubscription: (() => void) | null = null

    if (Platform.OS !== 'web') {
      // 1. Vérifier si une notification a ouvert l'app AVANT que le listener soit monté (cold start)
      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (response && isMounted) {
          const possibleLinkData1 = response.notification?.request?.content?.data?.link
          //@ts-expect-error type do not contain payload key inside trigger
          const possibleLinkData2 = response.notification?.request?.trigger?.payload?.link
          const link = parseHref(possibleLinkData1 ?? possibleLinkData2, 'push_notification')
          // Cold start : attendre 2s que l'app soit chargée
          if (link) setTimeout(() => router.push(link), 2000)
        }
      })

      // 2. Écouter les notifications suivantes (app déjà ouverte)
      expoNotificationSubscription = Notifications.addNotificationResponseReceivedListener((e) => {
        try {
          if (isMounted) {
            const possibleLinkData1 = e.notification?.request?.content?.data?.link
            //@ts-expect-error type do not contain payload key inside trigger
            const possibleLinkData2 = e.notification?.request?.trigger?.payload?.link
            const link = parseHref(possibleLinkData1 ?? possibleLinkData2, 'push_notification')
            // App déjà ouverte : navigation immédiate
            if (link) setTimeout(() => router.push(link), 100)
          }
        } catch (e) {
          if (e instanceof Error) {
            ErrorMonitor.log('Error while redirect notification list', {
              message: e.message,
              stack: e.stack,
            })
          }
        }
      })
    }

    fbNotificationSubscription = FB
      ? FB.messaging.onMessage((message: FirebaseMessagingTypes.RemoteMessage) => {
          if (message.data?.local) return

          if (Platform.OS !== 'web') {
            Notifications.scheduleNotificationAsync({
              content: {
                title: message.notification?.title,
                body: message.notification?.body,
                data: {
                  link: message.data?.link,
                  local: true,
                },
              },
              trigger: null,
            })
          } else {
            if (message?.notification?.title) {
              const link = parseHref(message?.data?.link, 'push_notification')
              toast.show(message.notification?.title, {
                message: message.notification?.body,
                type: 'info',
                action: link
                  ? {
                      onPress: () => router.push(link),
                      altText: 'Voir',
                    }
                  : undefined,
              })
            }
          }
        })
      : null

    return () => {
      isMounted = false
      expoNotificationSubscription?.remove()
      fbNotificationSubscription?.()
    }
  }, [])
}
