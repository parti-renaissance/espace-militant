import React from 'react'
import { useMedia } from 'tamagui'
import { EventFormContextProvider } from './context'
import EventDesktopScreen, { EventFormDesktopScreenSkeleton } from './EventFormDesktopScreen'
import EventFormMobileScreen, { EventFormMobileScreenSkeleton } from './EventFormMobileScreen'

export default function EventDetailsScreen() {
  const media = useMedia()

  return <EventFormContextProvider>{media.sm ? <EventFormMobileScreen /> : <EventDesktopScreen />}</EventFormContextProvider>
}

export function EventFormScreenSkeleton() {
  const media = useMedia()
  return media.sm ? <EventFormMobileScreenSkeleton /> : <EventFormDesktopScreenSkeleton />
}
