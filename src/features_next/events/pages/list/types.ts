import type { EmptyStateReason } from '@/features_next/events/components/feed-layout/EmptyStateSection'
import type { HubFeedRow as HubFeedRowType } from '@/services/hub/mapper'

export type HubFeedTab = 'all' | 'subscribed'

export type HubFeedSection = {
  id: string
  title: string
  rows: HubFeedRowType[]
}

export type FeedListItem =
  | { type: 'header'; sectionId: string; title: string }
  | { type: 'hub_row'; row: HubFeedRowType }
  | { type: 'empty_state'; reason: EmptyStateReason }
