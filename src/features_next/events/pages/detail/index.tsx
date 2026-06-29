import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'

import { DetailedAPIErrorPayload } from '@/core/errors'
import { useSession } from '@/ctx/SessionProvider'
import * as eventTypes from '@/services/events/schema'

import { EventContent } from './components/EventContent'
import { EventDenyScreen } from './components/EventDenyScreen'
import { EventSkeleton } from './components/EventSkeleton'
import { GreetingCreateModal } from './components/GreetingCreateModal'

export default function EventDetailsScreen({ data, isFetching = false }: { data: eventTypes.RestEvent; isFetching?: boolean }) {
  const { greet } = useLocalSearchParams<{ greet: string }>()
  const setIsGreet = () => {
    router.setParams({ greet: undefined })
  }
  const { user } = useSession()

  return (
    <>
      <GreetingCreateModal event={data} modalProps={{ open: greet === 'new', onClose: setIsGreet }} />
      <EventContent event={data} userUuid={user?.data?.uuid} isFetching={isFetching} />
    </>
  )
}

export function EventDetailsScreenSkeleton() {
  return <EventSkeleton />
}

export function EventDetailsScreenDeny({ error }: { error: DetailedAPIErrorPayload }) {
  return <EventDenyScreen error={error} />
}
