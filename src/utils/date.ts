import { format, parse } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import { fr } from 'date-fns/locale'

export const dateFormat = 'P'
export const timeFormat = 'p'
export const humanReadableDate = 'ccc d MMMM yyyy'
export const humanReadableDateShort = 'd MMMM yyyy'
export const dateTimeFormat = `${dateFormat} ${timeFormat}`

export const dateShortFormat = 'EE' // Mon, Tue, ...
export const dateValueFormat = 'd' // 1, 2, 3

export const agendaDateFormat = 'EE d'

export const getFormattedDate = (date: Date) => format(date, dateFormat, { locale: fr })

export const getIntlDate = (date: Date, convertToUTC: boolean = false) => {
  if (convertToUTC) {
    return format(fromZonedTime(date, 'Europe/Paris'), 'yyyy-MM-dd')
  }

  return format(date, 'yyyy-MM-dd')
}

export const getHumanFormattedDate = (date: Date) => format(date, humanReadableDate, { locale: fr })
export const getHumanFormattedDateShort = (date: Date) => format(date, humanReadableDateShort, { locale: fr })

export const getHumanFormattedTime = (date: Date) => format(date, timeFormat, { locale: fr })

export const getFormattedTime = (date: Date) => format(date, timeFormat, { locale: fr })

export const getAgendaDate = (date: Date) => format(date, agendaDateFormat, { locale: fr })

export const getNowFormattedDate = () => format(new Date(), humanReadableDate, { locale: fr })

export const getShortDayName = (date: Date) => format(date, dateShortFormat, { locale: fr })

export const getDayNumber = (date: Date) => format(date, dateValueFormat, { locale: fr })

export const parseFrenchDate = (input: string) => parse(input, 'dd/MM/yyyy', new Date())
