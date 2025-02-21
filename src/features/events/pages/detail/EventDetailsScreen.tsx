import React from 'react'
import { useSession } from '@/ctx/SessionProvider'
import { GreetingCreateModal } from '@/features/events/components/GreetingModals/GreetingCreateModal'
import * as eventTypes from '@/services/events/schema'
import { router, useLocalSearchParams } from 'expo-router'
import { useMedia } from 'tamagui'
import EventDesktopScreen, { EventDesktopScreenDeny, EventDesktopScreenSkeleton } from './EventDesktopScreen'
import EventMobileScreen, { EventMobileScreenDeny, EventMobileScreenSkeleton } from './EventMobileScreen'

export default function EventDetailsScreen({ data }: { data: eventTypes.RestEvent }) {
  const media = useMedia()
  const { greet } = useLocalSearchParams<{ greet: string }>()
  const setIsGreet = () => {
    router.setParams({ greet: undefined })
  }
  const { user } = useSession()
  return (
    <>
      <GreetingCreateModal event={data} modalProps={{ open: greet === 'new', onClose: setIsGreet }} />
      {media.sm ? <EventMobileScreen event={data} userUuid={user?.data?.uuid} /> : <EventDesktopScreen event={data} userUuid={user?.data?.uuid} />}
    </>
  )
}

export function EventDetailsScreenSkeleton() {
  const media = useMedia()
  return media.sm ? <EventMobileScreenSkeleton /> : <EventDesktopScreenSkeleton />
}

export function EventDetailsScreenDeny() {
  const media = useMedia()
  return media.sm ? <EventMobileScreenDeny /> : <EventDesktopScreenDeny />
}
