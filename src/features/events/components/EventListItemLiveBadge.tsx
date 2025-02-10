import VoxCard from '@/components/VoxCard/VoxCard'
import { RestItemEvent } from '@/services/events/schema'
import { getHumanFormattedTime } from '@/utils/date'
import { Radio } from '@tamagui/lucide-icons'
import { isToday } from 'date-fns'
import { XStack } from 'tamagui'
import { isEventHasNationalLive, isEventStarted } from '../utils'

export const EventListItemLiveBadge = ({ event }: { event: Partial<RestItemEvent> }) => {
  const startDate = event.begin_at ? new Date(event.begin_at) : null
  if (startDate === null) return false
  const isStartToday = isToday(startDate)

  return isEventHasNationalLive(event) && isStartToday ? (
    <XStack>
      <VoxCard.Chip alert icon={Radio}>
        {isEventStarted(event) ? 'En direct' : `En direct à ${getHumanFormattedTime(startDate)}`}
      </VoxCard.Chip>
    </XStack>
  ) : (
    false
  )
}
