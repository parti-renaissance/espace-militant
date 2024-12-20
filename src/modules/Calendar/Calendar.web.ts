import { useToastController } from '@tamagui/toast'
import { atcb_action } from 'add-to-calendar-button'
import { formatDate } from 'date-fns'
import { UseCreateEvent } from './CalendarTypes'
import { isAllday as getIsAllDay, handleCreateEventError, successToast } from './utils'

const useCreateEvent: UseCreateEvent = () => {
  const toast = useToastController()
  return async (event) => {
    const isAllday = getIsAllDay(event)
    return atcb_action({
      name: event.title,
      description: event.notes,
      startDate: event.startDate ? formatDate(event.startDate, 'yyyy-MM-dd') : undefined,
      endDate: !isAllday && event.endDate ? formatDate(event.endDate, 'yyyy-MM-dd') : undefined,
      startTime: !isAllday && event.startDate ? formatDate(event.startDate, 'HH:mm') : undefined,
      endTime: !isAllday && event.endDate ? formatDate(event.endDate, 'HH:mm') : undefined,
      location: event.location,
      timeZone: event.timeZone || 'Europe/Paris',
      language: 'fr',
      options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'MicrosoftTeams', 'Outlook.com', 'Yahoo'],
    })
      .then(() => {
        successToast(toast)
      })
      .catch((error) => {
        handleCreateEventError(error, toast)
      })
  }
}

export default useCreateEvent
