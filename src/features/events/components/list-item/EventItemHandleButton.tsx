import { ComponentPropsWithoutRef } from 'react'
import { Link } from 'expo-router'
import { isWeb } from 'tamagui'

import HandleButton from '@/components/Buttons/HandleButton'

import { RestEvent } from '@/services/events/schema'

import { isEventEditable, isEventEditorKnown, isEventToggleRegisterHided } from '../../utils'

type EventItemHandleButtonProps = {
  event: Partial<RestEvent>
  userUuid?: string
  buttonProps?: ComponentPropsWithoutRef<typeof HandleButton>
}

export const EventItemHandleButton = ({ event, userUuid, buttonProps }: EventItemHandleButtonProps) => {
  const canNavigateToEdit = isEventEditable(event) || isEventEditorKnown(event)

  if (!canNavigateToEdit) {
    return null
  }

  return (
    <Link
      href={{
        pathname: '/evenements/[id]/modifier',
        params: { id: event.slug! },
      }}
      asChild={!isWeb}
    >
      <HandleButton
        children="Modifier"
        testID="event-item-handle-button"
        shrink={!isEventToggleRegisterHided(event, userUuid)}
        {...buttonProps}
      />
    </Link>
  )
}
