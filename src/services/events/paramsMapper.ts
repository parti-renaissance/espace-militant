import { format } from 'date-fns'

import { EventFilters } from '@/core/entities/Event'

import { RestGetEventsRequest } from './schema'

type GetEventsSearchParametersMapperPropsBase = {
  page: number
  filters: EventFilters | undefined
  orderBySubscriptions?: boolean
  orderByBeginAt?: boolean
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

export const mapParams = ({ page, filters, orderByBeginAt, orderBySubscriptions }: GetEventsSearchParametersMapperProps): RestGetEventsRequest => {
  const p = { page, orderByBeginAt, orderBySubscriptions, ...filters }
  return Object.entries(p).reduce((acc, [key, value]) => {
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
}
