import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'

import { GreetingCreateModal } from '@/features_next/events/components/GreetingModals/GreetingCreateModal'

import { DetailedAPIErrorPayload } from '@/core/errors'
import { useSession } from '@/ctx/SessionProvider'
import * as eventTypes from '@/services/events/schema'

import { EventContent } from './components/EventContent'
import { EventDenyScreen } from './components/EventDenyScreen'
import { EventSkeleton } from './components/EventSkeleton'

export default function EventDetailsScreen({ data }: { data: eventTypes.RestEvent }) {
  const { greet } = useLocalSearchParams<{ greet: string }>()
  const setIsGreet = () => {
    router.setParams({ greet: undefined })
  }
  const { user } = useSession()

  return (
    <>
      <GreetingCreateModal event={data} modalProps={{ open: greet === 'new', onClose: setIsGreet }} />
      <EventContent event={data} userUuid={user?.data?.uuid} />
    </>
  )
}

export function EventDetailsScreenSkeleton() {
  return <EventSkeleton />
}

export function EventDetailsScreenDeny({ error }: { error: DetailedAPIErrorPayload }) {
  return <EventDenyScreen error={error} />
}
