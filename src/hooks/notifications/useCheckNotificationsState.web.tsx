import { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import fb from '@/config/firebaseConfig'
import FB, { AuthorizationStatus } from '@/config/firebaseConfig'
import { useAddPushToken } from '@/features/push-notification/hook/useAddPushToken'
import { useRemovePushToken } from '@/features/push-notification/hook/useRemovePushToken'
import { isSupported } from '@firebase/messaging'
import { useToastController } from '@tamagui/toast'
import { openSettings } from 'expo-linking'

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
    const permission = Notification.permission
    const granted = permission === 'granted'

    setNotificationGranted(granted)
    setNotificationGrantState(permission)
    setCanAsk(permission !== 'denied')

    if (permission === 'granted' && hasBeenGrantedOnce.current === null) {
      try {
        hasBeenGrantedOnce.current = await FB.messaging.getToken()
        postPushToken({ token: hasBeenGrantedOnce.current })
      } catch (e) {
        // Trigger an error if safari but not requested permission
      }
    }

    if (!granted && hasBeenGrantedOnce.current) {
      removePushToken()
      hasBeenGrantedOnce.current = null
    }
  }, [])

  const triggerNotificationRequest = useCallback(async () => {
    if (canAsk) {
      fb.messaging
        .requestPermission()
        .then((response) => {
          if (response === AuthorizationStatus.AUTHORIZED) {
            // We pass an empty object due to typing analysis default
            postPushToken({})
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
    notificationGrantState,
    canAsk,
    triggerNotificationRequest,
  }
}
