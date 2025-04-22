import { useCallback } from 'react'
import useCheckNotificationsState from '@/hooks/notifications/useCheckNotificationsState'
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
  const { notificationGranted, triggerNotificationRequest } = useCheckNotificationsState()

  const onPress = useCallback(() => {
    triggerNotificationRequest()
  }, [])

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
