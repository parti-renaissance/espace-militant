import { XStack } from 'tamagui'
import { Radio } from '@tamagui/lucide-icons'
import { isAfter, isBefore, isEqual, isToday } from 'date-fns'

import VoxCard from '@/components/VoxCard/VoxCard'

import { RestItemEvent } from '@/services/events/schema'
import { getHumanFormattedTime } from '@/utils/date'

import { isEventHasNationalLive, isEventStarted } from '../utils'

export const EventListItemLiveBadge = ({ event }: { event: Partial<RestItemEvent> }) => {
  const startDate = event.begin_at ? new Date(event.begin_at) : null
  const endDate = event.finish_at ? new Date(event.finish_at) : null

  if (startDate === null) return false

  const now = new Date()
  const isLiveNow = endDate ? (isAfter(now, startDate) || isEqual(now, startDate)) && (isBefore(now, endDate) || isEqual(now, endDate)) : false
  const isLiveDayBeforeStart = isToday(startDate) && (isBefore(now, startDate) || isEqual(now, startDate))
  const shouldDisplayBadge = isLiveDayBeforeStart || isLiveNow

  return isEventHasNationalLive(event) && shouldDisplayBadge ? (
    <XStack>
      <VoxCard.Chip alert icon={Radio}>
        {isEventStarted(event) ? 'En direct' : `En direct à ${getHumanFormattedTime(startDate)}`}
      </VoxCard.Chip>
    </XStack>
  ) : (
    false
  )
}
