import { z } from 'zod'

import * as schemas from '@/services/filters-collection/schema'
import { api } from '@/utils/api'

const GetFiltersCollectionRequestSchema = z.object({
  feature: z.string(),
  scope: z.string().optional(),
})

export type GetFiltersCollectionRequest = z.infer<typeof GetFiltersCollectionRequestSchema>

export const getFiltersCollection = (params: GetFiltersCollectionRequest) =>
  api({
    method: 'get',
    path: '/api/v3/filters',
    requestSchema: GetFiltersCollectionRequestSchema,
    responseSchema: schemas.FiltersCollectionResponseSchema,
    type: 'private',
    useParams: true,
  })(params)
