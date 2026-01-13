import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Linking } from 'react-native'
import { useSession } from '@/ctx/SessionProvider'
import FB from '@/config/firebaseConfig'
import { useAddPushToken } from '@/features/push-notification/hook/useAddPushToken'
import { useRemovePushToken } from '@/features/push-notification/hook/useRemovePushToken'
import { getPermissionsAsync, PermissionStatus } from 'expo-notifications'

export default function useCheckNotificationsState() {
  const [notificationGranted, setNotificationGranted] = useState<boolean | null>(null)
  const [notificationGrantState, setNotificationGrantState] = useState<string | null>(null)
  const hasBeenGrantedOnce = useRef<null | string>(null)
  const isCheckingPermissions = useRef(false)
  const { isAuth } = useSession()

  const { mutate: postPushToken } = useAddPushToken()
  const { mutate: removePushToken } = useRemovePushToken()

  const checkPermissions = useCallback(async () => {
    if (isCheckingPermissions.current) return
    isCheckingPermissions.current = true

    const { granted, status } = await getPermissionsAsync()
    setNotificationGranted(granted)
    setNotificationGrantState(status)

    if (granted && hasBeenGrantedOnce.current === null) {
      try {
        const token = await FB?.messaging.getToken()
        if (token) {
          hasBeenGrantedOnce.current = token
          postPushToken({ token })
        }
      } catch (e) {
        //
      }
    }

    if (!granted && hasBeenGrantedOnce.current) {
      removePushToken()
      hasBeenGrantedOnce.current = null
    }

    isCheckingPermissions.current = false
  }, [postPushToken, removePushToken])

  const triggerNotificationRequest = useCallback(async () => {
    const { canAskAgain, status } = await getPermissionsAsync()

    if (canAskAgain && status !== PermissionStatus.DENIED) {
      FB?.messaging
        .requestPermission({
          sound: true,
          alert: true,
        })
        .catch(() => {
          //
        })
    } else {
      Alert.alert('Notifications désactivées', 'Veuillez activer les notifications dans les paramètres pour rester informé.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Ouvrir les paramètres', onPress: Linking.openSettings },
      ])
    }
  }, [postPushToken, checkPermissions])

  useEffect(() => {
    if (isAuth) {
      checkPermissions()
      const interval = setInterval(() => {
        if (!isCheckingPermissions.current) {
          checkPermissions()
        }
      }, 10e3)

      return () => {
        clearInterval(interval)
      }
    }
  }, [checkPermissions, isAuth])

  return {
    notificationGranted,
    notificationGrantState,
    triggerNotificationRequest,
  }
}
