import { format } from 'date-fns'

import { EventFilters } from '@/core/entities/Event'

import { RestGetEventsRequest } from './schema'

type GetEventsSearchParametersMapperPropsBase = {
  page: number
  filters: EventFilters | undefined
  orderBySubscriptions?: boolean
  orderByBeginAt?: boolean
  /** Plafonné côté API (ex. 300). */
  pageSize?: number
  /** Filtre géographique ; les 4 valeurs sont requises côté client si ce champ est défini. */
  bbox?: {
    ne: { lat: number; lng: number }
    sw: { lat: number; lng: number }
  }
  /** Tri par distance Haversine ; les deux coordonnées sont envoyées ensemble. */
  sortAround?: { lat: number; lng: number }
  /** Si `true`, exclut les événements terminés (finishAt avant maintenant, côté API). */
  upcomingOnly?: boolean
}

export type GetEventsSearchParametersMapperProps =
  | (GetEventsSearchParametersMapperPropsBase & {
      zipCode?: string | undefined
      zoneCode?: string | undefined
    })
  | ({
      zoneCode: string
      zipCode: undefined
    } & GetEventsSearchParametersMapperPropsBase)
  | ({
      zipCode: string
      zoneCode: undefined
    } & GetEventsSearchParametersMapperPropsBase)

const paramsCollection = {
  finishAfter: (x: Date) => ({ 'finishAt[strictly_after]': format(x, 'yyyy-MM-dd HH:mm') }),
  searchText: (x: string) => ({ name: x }),
  eventMode: (x: string) => ({ mode: x }),
  orderBySubscriptions: (x: boolean) => ({ 'order[subscriptions]': x ? 'desc' : 'asc' }),
  orderByBeginAt: (x: boolean) => ({ 'order[beginAt]': x ? 'desc' : 'asc' }),
  zipCode: (x: string) => ({ zipCode: x }),
  zone: (x: string) => ({ zone: x }),
  page: (x: number) => ({ page: x }),
  subscribedOnly: (x: boolean) => ({ subscribedOnly: x }),
  pinned: (x: boolean) => ({ pinned: x }),
} as const

export const mapParams = ({
  page,
  filters,
  orderByBeginAt,
  orderBySubscriptions,
  pageSize,
  bbox,
  sortAround,
  upcomingOnly,
}: GetEventsSearchParametersMapperProps): RestGetEventsRequest => {
  const p = { page, orderByBeginAt, orderBySubscriptions, ...filters }
  const reduced = Object.entries(p).reduce((acc, [key, value]) => {
    if (key === 'zone' && value === 'all') {
      return acc
    }
    if (value === null || value === undefined) {
      return acc
    }
    if (value === '') {
      return acc
    }
    const map = paramsCollection[key as keyof typeof paramsCollection]
    return map ? { ...acc, ...map(value as never) } : acc
  }, {} as RestGetEventsRequest)

  return {
    ...reduced,
    ...(pageSize !== undefined ? { page_size: pageSize } : {}),
    ...(upcomingOnly !== undefined ? { upcomingOnly } : {}),
    ...(bbox
      ? {
          'bbox[ne][lat]': bbox.ne.lat,
          'bbox[ne][lng]': bbox.ne.lng,
          'bbox[sw][lat]': bbox.sw.lat,
          'bbox[sw][lng]': bbox.sw.lng,
        }
      : {}),
    ...(sortAround ? { lat: sortAround.lat, lng: sortAround.lng } : {}),
  }
}
