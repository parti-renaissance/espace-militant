import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import fb, { AuthorizationStatus } from '@/config/firebaseConfig'
import { useAddPushToken } from '@/features/push-notification/hook/useAddPushToken'
import { isSupported } from '@firebase/messaging'
import { useToastController } from '@tamagui/toast'
import { openSettings } from 'expo-linking'
import { getPermissionsAsync } from 'expo-notifications'
import { Button } from 'tamagui'
import BellOff from './BellOff'

/**
 * Handle the bell in header, if notification is granted, no bell is shown.
 * If notification is granted, we report it to the system to allow communication.
 *
 * It first of all test if notification is supported by browser/device before asking perms.
 *
 * @constructor
 */
export default function DisabledNotificationBell() {
  const [notificationsSupported, setNotificationsSupported] = useState(Platform.OS !== 'web')
  const [notificationGranted, setNotificationGranted] = useState<boolean | null>(null)
  const [notificationGrantState, setNotificationGrantState] = useState<string | null>(null)
  const [canAsk, setCanAsk] = useState<boolean | null>(null)

  const { mutate: postPushToken } = useAddPushToken()

  const toast = useToastController()

  const checkPermissions = useCallback(async () => {
    const { granted, canAskAgain, status } = await getPermissionsAsync()
    setNotificationGranted(granted)
    setCanAsk(canAskAgain)
    setNotificationGrantState(status)
  }, [])

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

  const onPress = useCallback(() => {
    if (canAsk) {
      fb.messaging
        .requestPermission()
        .then((response) => {
          if (response === AuthorizationStatus.AUTHORIZED) {
            postPushToken()
          }

          return response
        })
        .then(checkPermissions)
    } else if (Platform.OS !== 'web') {
      openSettings()
    } else {
      toast.show('Autorisez dans les préférences.')
    }
  }, [canAsk, checkPermissions, notificationGrantState])

  if (notificationGranted || notificationGranted === null) return null

  return (
    <Button
      onPress={onPress}
      icon={<BellOff size={16} />}
      borderRadius={100}
      variant={'outlined'}
      borderWidth={1}
      width={38}
      height={38}
      padding={0}
      margin={0}
    />
  )
}
