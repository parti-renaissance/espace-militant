import type { ComponentProps } from 'react'

import { ActionContent } from './components/ActionContent'
import { ActionDenyScreen } from './components/ActionDenyScreen'
import { ActionSkeleton } from './components/ActionSkeleton'
import type { RestActionFull } from '@/services/actions/schema'
import type { DetailedAPIErrorPayload } from '@/core/errors'

export default function ActionDetailsScreen({ data }: { data: RestActionFull }) {
  return <ActionContent data={data} />
}

export function ActionDetailsScreenSkeleton() {
  return <ActionSkeleton />
}

export function ActionDetailsScreenDeny({ error }: { error: DetailedAPIErrorPayload }) {
  return <ActionDenyScreen error={error} />
}

export { default as ActionForm, ActionFormScreenSkeleton } from './components/ActionForm'
