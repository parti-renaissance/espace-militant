import React from 'react'
import { RestGetMessageContentResponse, RestGetMessageResponse, RestGetMessageFiltersResponse } from '@/services/publications/schema'
import { RestPublicationStatsResponse } from '@/services/stats/schema'
import { PublicationContent } from './components/PublicationContent'
import { PublicationSkeleton } from './components/PublicationSkeleton'
import { PublicationDenyScreen } from './components/PublicationDenyScreen'
import { DetailedAPIErrorPayload } from '@/core/errors'

interface MessageDetailsScreenProps {
  data: RestGetMessageResponse
  content?: RestGetMessageContentResponse
  stats?: RestPublicationStatsResponse
  filters?: RestGetMessageFiltersResponse
  onRefreshStats?: () => void
  isRefreshingStats?: boolean
}

export default function MessageDetailsScreen(props: MessageDetailsScreenProps) {
  return <PublicationContent {...props} />
}

export function MessageDetailsScreenSkeleton() {
  return <PublicationSkeleton />
}

export function MessageDetailsScreenDeny({ error }: { error: DetailedAPIErrorPayload }) {
  return <PublicationDenyScreen error={error} />
}
