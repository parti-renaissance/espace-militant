import { ComponentPropsWithoutRef } from 'react'
import { VoxButton } from '@/components/Button'
import { RestItemEvent } from '@/services/events/schema'
import { Clock9, Users, XCircle } from '@tamagui/lucide-icons'
import { isEventCancelled, isEventCapacityReached, isEventPast } from '../utils'

export const useStatusChip = ({ event, buttonProps }: { event: Partial<RestItemEvent>; buttonProps?: ComponentPropsWithoutRef<typeof VoxButton> }) => {
  if (isEventCancelled(event)) {
    return (
      <VoxButton {...buttonProps} asChip iconLeft={XCircle} theme="orange" testID="status-event-chip">
        Annulé
      </VoxButton>
    )
  }
  if (isEventPast(event)) {
    return (
      <VoxButton {...buttonProps} asChip iconLeft={Clock9} theme="gray" testID="status-event-chip">
        Terminé
      </VoxButton>
    )
  }

  if (isEventCapacityReached(event)) {
    return (
      <VoxButton {...buttonProps} asChip iconLeft={Users} theme="gray" testID="status-event-chip">
        Complet
      </VoxButton>
    )
  }
  return null
}
