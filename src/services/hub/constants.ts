import type { HubItemsRequestParams } from './paramsMapper'

// ---------- Query keys ----------

export type HubItemsQueryScope = 'private' | 'public'

export const hubKeys = {
  all: ['hub'] as const,
  items: (params: HubItemsRequestParams & { page?: number }, scope: HubItemsQueryScope) =>
    [...hubKeys.all, 'items', scope, params] as const,
}

// ---------- Bbox géographique ----------

/** Même emprise que la carte événements — coins pour `bbox[ne|sw][lat|lng]` sur `GET /api/v3/hub-item`. */
export const FRANCE_METRO_HUB_BBOX = {
  ne: { lat: 51.6, lng: 9.7 },
  sw: { lat: 40.3, lng: -6.2 },
} as const

// ---------- Cache React Query ----------

/** Feeds paginés (liste, hub, bannière épinglée). */
export const HUB_ITEMS_FEED_STALE_TIME_MS = 5 * 60 * 1000
export const HUB_ITEMS_FEED_GC_TIME_MS = 10 * 60 * 1000

/** Snapshot une page (carte, en-tête hub). */
export const HUB_ITEMS_SNAPSHOT_STALE_TIME_MS = 60 * 1000
export const HUB_ITEMS_SNAPSHOT_GC_TIME_MS = 5 * 60 * 1000
