import type { HubItemTypeFilter } from '@/features_next/events/store/filterStore'
import { groupEventsBySection, isEventPast } from '@/features_next/events/utils'

import { mapHubItemToFeedRow, type HubFeedRow as HubFeedRowType } from '@/services/hub/mapper'
import type { RestHubItem } from '@/services/hub/schema'

import type { HubFeedSection } from '../types'

export const filterHubItemsBySearch = (items: RestHubItem[], searchText?: string) => {
  const search = searchText?.trim().toLowerCase() ?? ''
  if (!search) {
    return items
  }
  return items.filter((item) => item.name?.toLowerCase().includes(search))
}

export const excludeHubItemsByUuid = (items: RestHubItem[], uuids: Set<string>) => (uuids.size === 0 ? items : items.filter((item) => !uuids.has(item.uuid)))

export const mapHubItemsToFeedRows = (items: RestHubItem[]): HubFeedRowType[] =>
  items.map(mapHubItemToFeedRow).filter((row): row is HubFeedRowType => row !== null)

export const filterRowsByItemType = (rows: HubFeedRowType[], itemType: HubItemTypeFilter): HubFeedRowType[] => {
  if (itemType === 'all') return rows
  return rows.filter((row) => row.type === itemType)
}

const getRowBeginAt = (row: HubFeedRowType): string =>
  row.type === 'event' ? row.event.begin_at : (row.payload.date?.start?.toISOString() ?? '')

const isPastRow = (row: HubFeedRowType): boolean => isEventPast({ begin_at: getRowBeginAt(row) })

const defaultUpcomingTitle = (zoneLabel?: string) => (zoneLabel === 'Toutes' ? 'À venir' : zoneLabel ? zoneLabel.replace(' • ', ' - ') : 'À venir')

/** Regroupe le flux hub en sections événements, actions mélangées dans la même section (ordre API). */
export const groupHubFeedRows = (rows: HubFeedRowType[], options?: { zoneLabel?: string }): HubFeedSection[] => {
  const zoneLabel = options?.zoneLabel
  const eventRows = rows.filter((row): row is HubFeedRowType & { type: 'event' } => row.type === 'event')

  const eventSections = groupEventsBySection(
    eventRows.map((row) => row.event),
    options,
  )

  const eventUuidToSectionId = new Map(
    eventSections.flatMap((section) => (section.data ?? []).map((event) => [event.uuid, section.id] as const)),
  )

  const sectionTitles = new Map(eventSections.map((section) => [section.id, section.title]))
  sectionTitles.set('past', 'Événements passés')
  if (!sectionTitles.has('zone')) {
    sectionTitles.set('zone', defaultUpcomingTitle(zoneLabel))
  }

  const sectionRows = new Map<string, HubFeedRowType[]>(eventSections.map((section) => [section.id, [] as HubFeedRowType[]]))

  let lastUpcomingSectionId = eventSections.find((section) => section.id !== 'past')?.id ?? 'zone'

  for (const row of rows) {
    let sectionId: string

    if (row.type === 'event') {
      sectionId = eventUuidToSectionId.get(row.event.uuid) ?? 'zone'
      if (!isPastRow(row)) {
        lastUpcomingSectionId = sectionId
      }
    } else if (isPastRow(row)) {
      sectionId = 'past'
    } else {
      sectionId = lastUpcomingSectionId
    }

    if (!sectionRows.has(sectionId)) {
      sectionRows.set(sectionId, [])
    }
    sectionRows.get(sectionId)!.push(row)
  }

  const sectionOrder = eventSections.map((section) => section.id)

  return sectionOrder
    .map((id) => ({
      id,
      title: sectionTitles.get(id) ?? id,
      rows: sectionRows.get(id) ?? [],
    }))
    .filter((section) => section.rows?.length > 0 || (section.id === 'zone' && zoneLabel != null && zoneLabel !== 'Toutes'))
}
