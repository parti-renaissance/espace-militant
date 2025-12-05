import { ComponentPropsWithoutRef, useMemo } from 'react'
import { VoxButton } from '@/components/Button'
import { useStatusChip } from '@/features_next/events/hooks/useStatusChip'
import { RestItemEvent } from '@/services/events/schema'
import { XStack } from 'tamagui'
import {
  isEventAdherentDuesReserved,
  isEventAdherentReserved,
  isEventPartial,
  isEventRegister,
  isEventToggleRegisterDisabled,
  isEventToggleRegisterHided,
} from '../utils'
import { EventSubscribeButton } from './EventSubscribeButton'
import { EventSubscribePremiumLockButton, type PremiumLockButtonProps } from './EventSubscribePremiumLockButton'
import { EventUnSubscribeButton } from './EventUnSubscribeButton'

type EventItemSubscribeButtonProps = {
  event: Partial<RestItemEvent> & Pick<RestItemEvent, 'uuid' | 'slug'>
  userUuid?: string
  buttonProps?: ComponentPropsWithoutRef<typeof VoxButton>
}

export const EventToggleSubscribeButton = ({ event, userUuid, buttonProps }: EventItemSubscribeButtonProps) => {
  const isRegister = isEventRegister(event)
  const ButtonSub = isRegister ? EventUnSubscribeButton : EventSubscribeButton
  const isDisabled = isEventToggleRegisterDisabled(event)
  const shouldHide = isEventToggleRegisterHided(event, userUuid)
  const isAdh = isEventAdherentReserved(event)
  const isAdhDues = isEventAdherentDuesReserved(event)
  const isLocked = isEventPartial(event)
  const ButtonLock = (props: PremiumLockButtonProps) => <EventSubscribePremiumLockButton {...props} isDue={isAdhDues} />
  const Button = [isAdhDues || isAdh, isLocked].every(Boolean) ? ButtonLock : ButtonSub
  const StatusChip = useStatusChip({ event, buttonProps })
  const StatusChipOrButton = useMemo(() => (StatusChip && isDisabled ? () => StatusChip : Button), [StatusChip, Button, isDisabled])

  if (shouldHide) return false
  return (
    <XStack testID="event-item-toggle-subscribe-button">
      <StatusChipOrButton
        uuid={event.uuid}
        slug={event.slug}
        userUuid={userUuid}
        isPremium={isEventAdherentReserved(event) || isEventAdherentDuesReserved(event)}
        {...buttonProps}
      />
    </XStack>
  )
}
