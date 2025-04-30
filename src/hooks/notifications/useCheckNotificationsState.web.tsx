import { useCallback, useEffect, useRef, useState } from 'react'
import fb from '@/config/firebaseConfig'
import FB from '@/config/firebaseConfig'
import { useAddPushToken } from '@/features/push-notification/hook/useAddPushToken'
import { useRemovePushToken } from '@/features/push-notification/hook/useRemovePushToken'
import { isSupported } from '@firebase/messaging'
import { useToastController } from '@tamagui/toast'

export default function useCheckNotificationsState() {
  const [notificationsSupported, setNotificationsSupported] = useState(false)
  const [notificationGranted, setNotificationGranted] = useState<boolean | null>(null)
  const [notificationGrantState, setNotificationGrantState] = useState<string | null>(null)
  const hasBeenGrantedOnce = useRef<null | string>(null)

  const { mutate: postPushToken } = useAddPushToken()
  const { mutate: removePushToken } = useRemovePushToken()

  const toast = useToastController()

  const checkPermissions = useCallback(async () => {
    const permission = Notification.permission
    const granted = permission === 'granted'

    setNotificationGranted(granted)
    setNotificationGrantState(permission)

    if (permission === 'granted' && hasBeenGrantedOnce.current === null) {
      try {
        const token = await FB.messaging.getToken()
        hasBeenGrantedOnce.current = token
        postPushToken({ token })
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
    if (Notification.permission !== 'denied') {
      fb.messaging.requestPermission().catch().finally(checkPermissions)
    } else {
      toast.show('Autorisez dans les préférences.')
    }
  }, [postPushToken, checkPermissions])

  useEffect(() => {
    // Handle if firebase notifications is supported by peripheral or browser (otherwise it will throw an error in console)
    isSupported().then(setNotificationsSupported)
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
    triggerNotificationRequest,
  }
}
