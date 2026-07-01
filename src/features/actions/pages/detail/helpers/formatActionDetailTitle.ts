import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { ActionType, ReadableActionType } from '@/services/actions/schema'

export function formatActionDetailTitle(params: { date: Date; type: ActionType }) {
  const datePart = format(params.date, "EEEE d MMMM HH'h'mm", { locale: fr })
  const dateTitled = datePart.charAt(0).toUpperCase() + datePart.slice(1)
  return `${ReadableActionType[params.type]} ${dateTitled}`
}
