import { ComponentPropsWithoutRef } from 'react'
import { XStack } from 'tamagui'

import { VoxButton } from '@/components/Button'
import { useStatusChip } from '@/features/events/hooks/useStatusChip'

import { RestItemEvent } from '@/services/events/schema'

import {
  isEventAdherentDuesReserved,
  isEventAdherentReserved,
  isEventPartial,
  isEventRegister,
  isEventToggleRegisterDisabled,
  isEventToggleRegisterHided,
} from '../../utils'
import { EventSubscribeButton } from './EventSubscribeButton'
import { EventSubscribePremiumLockButton } from './EventSubscribePremiumLockButton'
import { EventUnSubscribeButton } from './EventUnSubscribeButton'

type EventItemSubscribeButtonProps = {
  event: Partial<RestItemEvent> & Pick<RestItemEvent, 'uuid' | 'slug'>
  userUuid?: string
  buttonProps?: ComponentPropsWithoutRef<typeof VoxButton>
}

export const EventToggleSubscribeButton = ({ event, userUuid, buttonProps }: EventItemSubscribeButtonProps) => {
  const isRegister = isEventRegister(event)
  const isDisabled = isEventToggleRegisterDisabled(event)
  const shouldHide = isEventToggleRegisterHided(event, userUuid)
  const isAdh = isEventAdherentReserved(event)
  const isAdhDues = isEventAdherentDuesReserved(event)
  const isLocked = isEventPartial(event)
  const statusChip = useStatusChip({ event, buttonProps })
  const isPremiumLock = [isAdhDues || isAdh, isLocked].every(Boolean)
  const subscribeButtonProps = {
    uuid: event.uuid,
    slug: event.slug,
    userUuid,
    isPremium: isEventAdherentReserved(event) || isEventAdherentDuesReserved(event),
    ...buttonProps,
  }

  if (shouldHide) return false

  const subscribeControls = isPremiumLock ? (
    <EventSubscribePremiumLockButton {...subscribeButtonProps} isDue={isAdhDues} />
  ) : isRegister ? (
    <EventUnSubscribeButton {...subscribeButtonProps} />
  ) : (
    <EventSubscribeButton {...subscribeButtonProps} />
  )

  return (
    <XStack testID="event-item-toggle-subscribe-button">{statusChip && isDisabled ? statusChip : subscribeControls}</XStack>
  )
}
