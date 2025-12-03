import { ComponentPropsWithoutRef } from 'react'
import HandleButton from '@/components/Buttons/HandleButton'
import { RestEvent } from '@/services/events/schema'
import { Link } from 'expo-router'
import { isWeb } from 'tamagui'
import { isEventEditable, isEventToggleRegisterHided } from '../utils'

type EventItemHandleButtonProps = {
  event: Partial<RestEvent>
  userUuid?: string
  buttonProps?: ComponentPropsWithoutRef<typeof HandleButton>
}

export const EventItemHandleButton = ({ event, userUuid, buttonProps }: EventItemHandleButtonProps) => {
  return isEventEditable(event) ? (
    <Link
      href={{
        pathname: '/(militant)/evenements/[id]/modifier',
        params: { id: event.slug! },
      }}
      asChild={!isWeb}
    >
      <HandleButton children="Modifier" testID="event-item-handle-button" shrink={!isEventToggleRegisterHided(event, userUuid)} {...buttonProps} />
    </Link>
  ) : null
}
