import type { EmptyStateReason } from '@/features/events/components/feed-layout/EmptyStateSection'

import type { HubFeedRow as HubFeedRowType } from '@/services/hub/mapper'

import type { FeedListItem, HubFeedTab } from '../types'
import { groupHubFeedRows } from './hubFeed'

type BuildFeedStateOptions = {
  activeTab: HubFeedTab
  isFetching: boolean
  search: string
  zoneLabel?: string
}

export const buildFeedState = (
  feedRows: HubFeedRowType[],
  { activeTab, isFetching, search, zoneLabel }: BuildFeedStateOptions,
): { sectionedData: FeedListItem[]; emptyReason: EmptyStateReason } => {
  if (isFetching && feedRows?.length === 0) {
    return { sectionedData: [], emptyReason: { kind: 'generic' } }
  }

  const sections = groupHubFeedRows(feedRows, { zoneLabel })
  const hasUpcoming = sections.some((s) => s.id !== 'past' && s.rows?.length > 0)
  const hasOnlyPast = !hasUpcoming && sections.some((s) => s.id === 'past' && s.rows?.length > 0)
  const isSearchActive = (search?.trim()?.length ?? 0) > 0

  let globalReason: EmptyStateReason | null = null

  if (feedRows?.length === 0) {
    if (isSearchActive) globalReason = { kind: 'search_no_results', search }
    else if (activeTab === 'subscribed') globalReason = { kind: 'subscriptions_empty' }
    else if (zoneLabel && zoneLabel !== 'Toutes') globalReason = { kind: 'zone_no_upcoming', zoneLabel }
    else globalReason = { kind: 'generic' }
  } else if (hasOnlyPast && (isSearchActive || activeTab === 'subscribed')) {
    globalReason = activeTab === 'subscribed' ? { kind: 'subscriptions_no_upcoming' } : { kind: 'search_no_upcoming', search: search.trim() || undefined }
  }

  const items: FeedListItem[] = []

  if (globalReason && feedRows?.length > 0) {
    items.push({ type: 'empty_state', reason: globalReason })
  }

  sections.forEach((section) => {
    if (section.id === 'zone' && section.rows?.length === 0 && zoneLabel && zoneLabel !== 'Toutes') {
      if (!globalReason) {
        items.push({ type: 'empty_state', reason: { kind: 'zone_no_upcoming', zoneLabel } })
      }
      return
    }

    if (section.rows?.length > 0) {
      items.push({ type: 'header', sectionId: section.id, title: section.title })
      section.rows.forEach((row) => items.push({ type: 'hub_row', row }))
    }
  })

  return { sectionedData: items, emptyReason: globalReason ?? { kind: 'generic' } }
}
