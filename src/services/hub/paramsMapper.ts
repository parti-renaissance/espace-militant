import type { RestGetHubItemsRequest } from './schema'

type HubBeginAtFilter = {
  strictlyAfter?: string | Date
  after?: string | Date
  strictlyBefore?: string | Date
  before?: string | Date
}

const toIsoString = (value: string | Date) => (value instanceof Date ? value.toISOString() : value)

const mapBeginAt = (beginAt: HubBeginAtFilter): Partial<RestGetHubItemsRequest> => ({
  ...(beginAt.strictlyAfter !== undefined ? { 'beginAt[strictly_after]': toIsoString(beginAt.strictlyAfter) } : {}),
  ...(beginAt.after !== undefined ? { 'beginAt[after]': toIsoString(beginAt.after) } : {}),
  ...(beginAt.strictlyBefore !== undefined ? { 'beginAt[strictly_before]': toIsoString(beginAt.strictlyBefore) } : {}),
  ...(beginAt.before !== undefined ? { 'beginAt[before]': toIsoString(beginAt.before) } : {}),
})

export type GetHubItemsParametersMapperProps = {
  page: number
  /** Plafonné côté API (max 300). */
  pageSize?: number
  /** Filtre géographique ; les 4 valeurs sont requises côté client si ce champ est défini. */
  bbox?: {
    ne: { lat: number; lng: number }
    sw: { lat: number; lng: number }
  }
  /** Tri par distance Haversine ; les deux coordonnées sont envoyées ensemble. */
  sortAround?: { lat: number; lng: number }
  zoneCode?: string
  beginAt?: HubBeginAtFilter
  scope?: string
  subscribedOnly?: boolean
  upcomingOnly?: boolean
  pinned?: boolean
}

export const mapParams = ({
  page,
  pageSize,
  bbox,
  sortAround,
  zoneCode,
  beginAt,
  scope,
  subscribedOnly,
  upcomingOnly,
  pinned,
}: GetHubItemsParametersMapperProps): RestGetHubItemsRequest => ({
  page,
  ...(pageSize !== undefined ? { page_size: pageSize } : {}),
  ...(zoneCode !== undefined && zoneCode !== 'all' ? { zone: zoneCode } : {}),
  ...(scope !== undefined ? { scope } : {}),
  ...(subscribedOnly ? { subscribedOnly: true } : {}),
  ...(upcomingOnly ? { upcomingOnly: true } : {}),
  ...(pinned ? { pinned: true } : {}),
  ...(bbox
    ? {
        'bbox[ne][lat]': bbox.ne.lat,
        'bbox[ne][lng]': bbox.ne.lng,
        'bbox[sw][lat]': bbox.sw.lat,
        'bbox[sw][lng]': bbox.sw.lng,
      }
    : {}),
  ...(sortAround ? { lat: sortAround.lat, lng: sortAround.lng } : {}),
  ...(beginAt ? mapBeginAt(beginAt) : {}),
})

export type HubItemsRequestParams = Omit<GetHubItemsParametersMapperProps, 'page'>
