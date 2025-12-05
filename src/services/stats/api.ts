import * as schemas from '@/services/stats/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

export const getPublicationStats = (props: { uuid: string }) =>
  api({
    method: 'get',
    path: `/api/v3/stats/publication/${props.uuid}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestPublicationStatsResponseSchema,
    type: 'private',
  })()

export const getEventStats = (props: { uuid: string }) =>
  api({
    method: 'get',
    path: `/api/v3/stats/event/${props.uuid}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestEventStatsResponseSchema,
    type: 'private',
  })()
