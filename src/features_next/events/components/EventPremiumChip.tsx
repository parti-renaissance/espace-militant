import VoxCard from '@/components/VoxCard/VoxCard'
import { RestItemEvent } from '@/services/events/schema'
import { XStack } from 'tamagui'
import { isEventAdherentDuesReserved, isEventAdherentReserved, isEventPartial, isEventPrivate, isEventInvitationAgora } from '../utils'

export const EventPremiumChip = ({ event }: { event: Partial<RestItemEvent> }) => {
  const isAdh = isEventAdherentReserved(event)
  const isAdhDues = isEventAdherentDuesReserved(event)
  const isLocked = isEventPartial(event)
  const isPrivate = isEventPrivate(event)
  const isInvitationAgora = isEventInvitationAgora(event)

  return [isAdh, isAdhDues, isPrivate, isInvitationAgora].some(Boolean) ? (
    <XStack testID="event-premium-chip">
      <VoxCard.AdhLock lock={isLocked} due={isAdhDues} isPrivate={isPrivate} isInvitationAgora={isInvitationAgora} />
    </XStack>
  ) : (
    false
  )
}
