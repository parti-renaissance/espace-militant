import React from 'react'
import { useMedia } from 'tamagui'
import { EventFormContextProvider, EventFormProps } from './context'
import { EventFormDesktopScreen } from './components/EventFormDesktopScreen'
import EventFormMobileScreen from './components/EventFormMobileScreen'
import { EventFormDesktopScreenSkeleton, EventFormMobileScreenSkeleton } from './components/EventFormSkeleton'

export default function EventFormScreen(props: EventFormProps) {
  const media = useMedia()

  return (
    <EventFormContextProvider edit={props.edit}>
      {media.sm ? <EventFormMobileScreen /> : <EventFormDesktopScreen />}
    </EventFormContextProvider>
  )
}

export function EventFormScreenSkeleton(props?: { editMode?: boolean }) {
  const media = useMedia()
  return media.sm ? <EventFormMobileScreenSkeleton editMode={props?.editMode} /> : <EventFormDesktopScreenSkeleton editMode={props?.editMode} />
}
