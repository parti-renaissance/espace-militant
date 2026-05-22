import { router, useLocalSearchParams } from 'expo-router'

import type { DetailedAPIErrorPayload } from '@/core/errors'
import type { RestActionFull } from '@/services/actions/schema'

import { ActionContent } from './components/ActionContent'
import { ActionDenyScreen } from './components/ActionDenyScreen'
import { ActionSkeleton } from './components/ActionSkeleton'
import { GreetingCreateModal } from './components/GreetingCreateModal'

export default function ActionDetailsScreen({ data }: { data: RestActionFull }) {
  const { greet } = useLocalSearchParams<{ greet: string }>()
  const setIsGreet = () => {
    router.setParams({ greet: undefined })
  }

  return (
    <>
      <GreetingCreateModal action={data} modalProps={{ open: greet === 'new', onClose: setIsGreet }} />
      <ActionContent data={data} />
    </>
  )
}

export function ActionDetailsScreenSkeleton() {
  return <ActionSkeleton />
}

export function ActionDetailsScreenDeny({ error }: { error: DetailedAPIErrorPayload }) {
  return <ActionDenyScreen error={error} />
}
