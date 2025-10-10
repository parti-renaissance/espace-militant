import * as schemas from '@/services/stats/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

export const getPublicationStats = (props: { uuid: string; scope: string }) =>
  api({
    method: 'get',
    path: `/api/v3/stats/publication/${props.uuid}?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestPublicationStatsResponseSchema,
    type: 'private',
  })()

