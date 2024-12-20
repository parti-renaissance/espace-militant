import { useToastController } from '@tamagui/toast'
import { CalendarDialogResultActions, createEventInCalendarAsync, getCalendarPermissionsAsync, requestCalendarPermissionsAsync } from 'expo-calendar'
import * as Linking from 'expo-linking'
import { UseCreateEvent } from './CalendarTypes'
import { isAllday as getIsAllDay, handleCreateEventError, successToast } from './utils'

const useCreateEvent: UseCreateEvent = () => {
  const toast = useToastController()

  const manualRequest = async () => {
    toast.show('Authorisation requis', {
      message: "Touchez ici pour activer l'accès à votre calendrier, et réessayez",
      type: 'info',
      action: {
        altText: 'Ouvrir les paramètres',
        onPress: () => Linking.openSettings(),
      },
    })
  }
  return async (event) => {
    const isAllday = getIsAllDay(event)
    const { status, canAskAgain } = await getCalendarPermissionsAsync()

    if (status !== 'granted') {
      if (canAskAgain) {
        await requestCalendarPermissionsAsync().then((permi) => {
          if (permi.status !== 'granted') {
            manualRequest()
          }
        })
      } else {
        manualRequest()
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
