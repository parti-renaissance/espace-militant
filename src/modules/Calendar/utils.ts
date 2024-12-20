import { Platform } from 'react-native'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { useToastController } from '@tamagui/toast'
import { isSameHour } from 'date-fns'
import { CreateEventPayload } from './CalendarTypes'

export const isAllday = (event: CreateEventPayload) => (event.startDate && event.endDate && isSameHour(event.startDate, event.endDate)) || !event.endDate

export const handleCreateEventError = (error: unknown, toast: ReturnType<typeof useToastController>) => {
  if (error instanceof Error) {
    ErrorMonitor.log(`${Platform.OS}: error while creating event`, { error })
  }
  toast.show('Error', {
    message: "Nous n'avons pas pu ajouter l'événement au calendrier",
  })
}

export const successToast = (toast: ReturnType<typeof useToastController>) => {
  toast.show('Calendrier', {
    message: "L'événement a bien été ajouté au calendrier",
    type: 'success',
  })
}
