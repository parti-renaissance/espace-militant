import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns'
import { fr } from 'date-fns/locale'

export const DateFormatter = {
  format: (date: Date, pattern: string): string => {
    return format(date, pattern, { locale: fr })
  },
}

export function relativeDateFormatter(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = differenceInDays(now, date);

  if (daysDiff < 7) {
    return `il y a ${formatDistanceToNowStrict(date, { addSuffix: false, locale: fr })}`;
  } else {
    return `le ${format(date, 'dd/MM/yyyy', { locale: fr })}`;
  }
}