import { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import fb from '@/config/firebaseConfig'
import FB, { AuthorizationStatus } from '@/config/firebaseConfig'
import { useAddPushToken } from '@/features/push-notification/hook/useAddPushToken'
import { useRemovePushToken } from '@/features/push-notification/hook/useRemovePushToken'
import { isSupported } from '@firebase/messaging'
import { useToastController } from '@tamagui/toast'
import { openSettings } from 'expo-linking'
import { getPermissionsAsync } from 'expo-notifications'

export default function useCheckNotificationsState() {
  const [notificationsSupported, setNotificationsSupported] = useState(Platform.OS !== 'web')
  const [notificationGranted, setNotificationGranted] = useState<boolean | null>(null)
  const [notificationGrantState, setNotificationGrantState] = useState<string | null>(null)
  const [canAsk, setCanAsk] = useState<boolean | null>(null)
  const hasBeenGrantedOnce = useRef<null | string>(null)

  const { mutate: postPushToken } = useAddPushToken()
  const { mutate: removePushToken } = useRemovePushToken()

  const toast = useToastController()

  const checkPermissions = useCallback(async () => {
    const { granted, canAskAgain, status } = await getPermissionsAsync()
    setNotificationGranted(granted)
    setCanAsk(canAskAgain)
    setNotificationGrantState(status)
    if (granted && hasBeenGrantedOnce.current === null) {
      hasBeenGrantedOnce.current = await FB.messaging.getToken()
    }

    if (!granted && hasBeenGrantedOnce.current) {
      removePushToken({
        identifier: hasBeenGrantedOnce.current,
        source: 'vox',
      })
      hasBeenGrantedOnce.current = null
    }
  }, [])

  const triggerNotificationRequest = useCallback(async () => {
    const { canAskAgain } = await getPermissionsAsync()

    if (canAskAgain) {
      fb.messaging
        .requestPermission()
        .then((response) => {
          if (response === AuthorizationStatus.AUTHORIZED) {
            postPushToken()
          }

          return response
        })
        .then(checkPermissions)
        .catch(() => {
          //
        })
    } else if (Platform.OS !== 'web') {
      await openSettings()
    } else {
      toast.show('Autorisez dans les préférences.')
    }
  }, [postPushToken, checkPermissions])

  useEffect(() => {
    // Handle if firebase notifications is supported by peripheral or browser (otherwise it will throw an error in console)
    if (Platform.OS === 'web') {
      isSupported().then(setNotificationsSupported)
    }
  }, [])

  useEffect(() => {
    if (notificationsSupported) {
      checkPermissions()
      const interval = setInterval(checkPermissions, 10e3)

      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    }
  }, [notificationsSupported])

  return {
    notificationGranted,
    notificationsSupported,
    notificationGrantState,
    canAsk,
    triggerNotificationRequest,
  }
}
