import { Alert, Linking } from 'react-native'
import { CalendarDialogResultActions, createEventInCalendarAsync, getCalendarPermissionsAsync, requestCalendarPermissionsAsync } from 'expo-calendar'
import { useToastController } from '@tamagui/toast'

import { UseCreateEvent } from './CalendarTypes'
import { isAllday as getIsAllDay, handleCreateEventError, successToast } from './utils'

const useCreateEvent: UseCreateEvent = () => {
  const toast = useToastController()

  const showCalendarPermissionAlert = () => {
    Alert.alert(
      'Accès au calendrier requis',
      "Veuillez autoriser l'accès au calendrier dans les paramètres pour continuer.",
      [
        {
          text: 'Ouvrir les réglages',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Plus tard',
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
      },
    )
  }
  return async (event) => {
    const isAllday = getIsAllDay(event)
    const { status, canAskAgain } = await getCalendarPermissionsAsync()

    if (status !== 'granted') {
      if (canAskAgain) {
        await requestCalendarPermissionsAsync().then((permi) => {
          if (permi.status !== 'granted') {
            showCalendarPermissionAlert()
          }
        })
      } else {
        showCalendarPermissionAlert()
      }
      return
    }

    return createEventInCalendarAsync({
      ...event,
      allDay: isAllday,
      startDate: event.startDate ? event.startDate : undefined,
      endDate: !isAllday && event.endDate ? event.endDate : undefined,
    })
      .then(({ action }) => {
        if (action === CalendarDialogResultActions.saved || action === CalendarDialogResultActions.done) {
          successToast(toast)
        }
      })
      .catch((error) => {
        handleCreateEventError(error, toast)
      })
  }
}

export default useCreateEvent
