import { Alert, Linking, Platform } from 'react-native'
import * as Calendar from 'expo-calendar'
import { useToastController } from '@tamagui/toast'

import { UseCreateEvent } from './CalendarTypes'
import { isAllday as getIsAllDay, handleCreateEventError, successToast } from './utils'

const getWritableCalendar = async () => {
  if (Platform.OS === 'ios') {
    return Calendar.getDefaultCalendarSync()
  }

  const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT)
  const calendar =
    calendars.find((c) => c.allowsModifications && c.isPrimary) ?? calendars.find((c) => c.allowsModifications)

  if (!calendar) {
    throw new Error('No writable calendar found')
  }

  return calendar
}

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
    try {
      const isAllday = getIsAllDay(event)
      let permission = await Calendar.getCalendarPermissions(true)

      if (permission.status !== 'granted') {
        if (permission.canAskAgain) {
          permission = await Calendar.requestCalendarPermissions(true)
        }

        if (permission.status !== 'granted') {
          showCalendarPermissionAlert()
          return
        }
      }

      const calendar = await getWritableCalendar()
      const { action } = await calendar.addEventWithForm({
        title: event.title,
        location: event.location ?? undefined,
        notes: event.notes,
        url: event.url,
        allDay: isAllday,
        startDate: event.startDate ? event.startDate : undefined,
        endDate: !isAllday && event.endDate ? event.endDate : undefined,
      })

      if (action === Calendar.CalendarDialogResultActions.saved || action === Calendar.CalendarDialogResultActions.done) {
        successToast(toast)
      }
    } catch (error) {
      handleCreateEventError(error, toast)
    }
  }
}

export default useCreateEvent
