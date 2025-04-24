import { useCallback, useEffect, useRef, useState } from 'react'
import fb from '@/config/firebaseConfig'
import FB, { AuthorizationStatus } from '@/config/firebaseConfig'
import { useAddPushToken } from '@/features/push-notification/hook/useAddPushToken'
import { useRemovePushToken } from '@/features/push-notification/hook/useRemovePushToken'
import { useToastController } from '@tamagui/toast'
import { getPermissionsAsync } from 'expo-notifications'

export default function useCheckNotificationsState() {
  const [notificationGranted, setNotificationGranted] = useState<boolean | null>(null)
  const [notificationGrantState, setNotificationGrantState] = useState<string | null>(null)
  const hasBeenGrantedOnce = useRef<null | string>(null)

  const { mutate: postPushToken } = useAddPushToken()
  const { mutate: removePushToken } = useRemovePushToken()

  const toast = useToastController()

  const checkPermissions = useCallback(async () => {
    const { granted, status } = await getPermissionsAsync()
    setNotificationGranted(granted)
    setNotificationGrantState(status)

    if (granted && hasBeenGrantedOnce.current === null) {
      try {
        hasBeenGrantedOnce.current = await FB.messaging.getToken()
        postPushToken({ token: hasBeenGrantedOnce.current })
      } catch (e) {
        //
      }
    }

    if (!granted && hasBeenGrantedOnce.current) {
      removePushToken()
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
            // We pass an empty object due to typing analysis default
            postPushToken({})
          }

          return response
        })
        .then(checkPermissions)
        .catch(() => {
          //
        })
    } else {
      toast.show('Autorisez dans les préférences.')
    }
  }, [postPushToken, checkPermissions])

  useEffect(() => {
    checkPermissions()
    const interval = setInterval(checkPermissions, 10e3)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  return {
    notificationGranted,
    notificationGrantState,
    triggerNotificationRequest,
  }
}
