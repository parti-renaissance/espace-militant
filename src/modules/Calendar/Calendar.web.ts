import { useToastController } from '@tamagui/toast'
import { atcb_action } from 'add-to-calendar-button'
import { formatInTimeZone } from 'date-fns-tz'
import { UseCreateEvent } from './CalendarTypes'
import { isAllday as getIsAllDay, handleCreateEventError, successToast } from './utils'

const toDate = (value: Date | string | undefined): Date | undefined => {
  if (value == null) return undefined
  return value instanceof Date ? value : new Date(value)
}

const useCreateEvent: UseCreateEvent = () => {
  const toast = useToastController()
  return async (event) => {
    const isAllday = getIsAllDay(event)
    const timeZone = event.timeZone || 'Europe/Paris'
    const start = toDate(event.startDate)
    const end = toDate(event.endDate)
    return atcb_action({
      name: event.title,
      description: event.notes,
      startDate: start ? formatInTimeZone(start, timeZone, 'yyyy-MM-dd') : undefined,
      endDate: !isAllday && end ? formatInTimeZone(end, timeZone, 'yyyy-MM-dd') : undefined,
      startTime: !isAllday && start ? formatInTimeZone(start, timeZone, 'HH:mm') : undefined,
      endTime: !isAllday && end ? formatInTimeZone(end, timeZone, 'HH:mm') : undefined,
      location: event.location ?? undefined,
      timeZone,
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
