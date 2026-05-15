import { mapParams, type GetHubItemsParametersMapperProps } from '@/services/hub/paramsMapper'
import * as schemas from '@/services/hub/schema'
import { api } from '@/utils/api'

export const getHubItems = (params: GetHubItemsParametersMapperProps) =>
  api({
    method: 'get',
    path: '/api/v3/hub-item',
    requestSchema: schemas.RestGetHubItemsRequestSchema,
    responseSchema: schemas.RestGetHubItemsResponseSchema,
    type: 'private',
  })(mapParams(params))
