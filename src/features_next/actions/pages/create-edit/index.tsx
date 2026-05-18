import React from 'react'
import { useMedia } from 'tamagui'

import ActionCancelModal from './components/ActionCancelModal'
import ActionFormDesktopScreen from './components/ActionFormDesktopScreen'
import ActionFormMobileScreen from './components/ActionFormMobileScreen'
import { ActionFormScreenSkeleton } from './components/ActionFormSkeleton'
import { ActionFormContextProvider, type ActionFormProps } from './helpers/context'

export default function ActionFormScreen(props: ActionFormProps) {
  const media = useMedia()

  return (
    <ActionFormContextProvider edit={props.edit}>
      {media.sm ? <ActionFormMobileScreen /> : <ActionFormDesktopScreen />}
      <ActionCancelModal />
    </ActionFormContextProvider>
  )
}

export { ActionFormScreenSkeleton }
