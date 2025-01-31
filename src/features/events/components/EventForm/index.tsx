import React from 'react'
import { useMedia } from 'tamagui'
import { EventFormContextProvider } from './context'
import EventDesktopScreen, { EventFormDesktopScreenSkeleton } from './EventFormDesktopScreen'
import EventFormMobileScreen, { EventFormMobileScreenSkeleton } from './EventFormMobileScreen'
import { EventFormProps } from './types'

export default function EventDetailsScreen(props: EventFormProps) {
  const media = useMedia()

  return <EventFormContextProvider edit={props.edit}>{media.sm ? <EventFormMobileScreen /> : <EventDesktopScreen />}</EventFormContextProvider>
}

export function EventFormScreenSkeleton(props?: { editMode?: boolean }) {
  const media = useMedia()
  return media.sm ? <EventFormMobileScreenSkeleton editMode={props?.editMode} /> : <EventFormDesktopScreenSkeleton editMode={props?.editMode} />
}
