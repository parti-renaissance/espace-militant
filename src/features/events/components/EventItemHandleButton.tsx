import { ComponentPropsWithoutRef } from 'react'
import HandleButton from '@/components/Buttons/HandleButton'
import { RestEvent } from '@/services/events/schema'
import { Href, Link } from 'expo-router'
import { isWeb } from 'tamagui'
import { isEventEditable, isEventToggleRegisterHided } from '../utils'

type EventItemHandleButtonProps = {
  event: Partial<RestEvent>
  userUuid?: string
  buttonProps?: ComponentPropsWithoutRef<typeof HandleButton>
}

export const EventItemHandleButton = ({ event, userUuid, buttonProps }: EventItemHandleButtonProps) => {
  return isEventEditable(event) ? (
    <Link href={event.edit_link as Href<string>} asChild={!isWeb}>
      <HandleButton testID="event-item-handle-button" shrink={!isEventToggleRegisterHided(event, userUuid)} {...buttonProps} />
    </Link>
  ) : null
}
