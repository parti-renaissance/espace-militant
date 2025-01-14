import { useEffect } from 'react'
import { Platform } from 'react-native'
import FB, { AuthorizationStatus } from '@/config/firebaseConfig'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { useToastController } from '@tamagui/toast'
import { useQuery } from '@tanstack/react-query'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { parseHref } from '../utils'
import { useAddPushToken } from './useAddPushToken'

const SOURCE = 'vox'

const usePermission = (options: { enable: boolean }) => {
  return useQuery({
    queryKey: ['permission', SOURCE],
    queryFn: async () => {
      const authStatus = await FB.messaging.requestPermission({
        sound: true,
        alert: true,
      })
      return authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL
    },
    ...options,
  })
}

export const useInitPushNotification = (props: { enable: boolean }) => {
  const { mutateAsync: postPushToken } = useAddPushToken()
  const { data: hasPermission } = usePermission({ enable: props.enable })
  const toast = useToastController()

  useEffect(() => {
    if (!hasPermission || !props.enable) return
    let isMounted = true
    let expoNotificationSubscription: Notifications.Subscription | null = null
    let fbNotificationSubscription: (() => void) | null = null

    postPushToken()

    if (Platform.OS !== 'web') {
      expoNotificationSubscription = Notifications.addNotificationResponseReceivedListener((e) => {
        try {
          if (isMounted) {
            const possibleLinkData1 = e.notification?.request?.content?.data?.link
            //@ts-expect-error type do not contain payload key inside trigger
            const possibleLinkData2 = e.notification?.request?.trigger?.payload?.link
            const link = parseHref(possibleLinkData1 ?? possibleLinkData2)
            if (link) setTimeout(() => router.replace(link), 1)
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

    fbNotificationSubscription = FB.messaging.onMessage((message) => {
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
          const link = parseHref(message?.data?.link)
          toast.show(message.notification?.title, {
            message: message.notification?.body,
            type: 'info',
            action: link
              ? {
                  onPress: () => router.replace(link),
                  altText: 'Voir',
                }
              : undefined,
          })
        }
      }
    })

    return () => {
      isMounted = false
      expoNotificationSubscription?.remove()
      fbNotificationSubscription?.()
    }
  }, [hasPermission, props.enable])
}
