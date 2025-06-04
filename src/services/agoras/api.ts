import * as schemas from '@/services/agoras/schema'
import { api } from '@/utils/api'

export const getAgoras = (params: schemas.RestGetAgorasRequest = {}) =>
  api({
    method: 'GET',
    path: '/api/v3/agoras',
    requestSchema: schemas.RestGetAgorasRequestSchema,
    responseSchema: schemas.RestGetAgorasResponseSchema,
    type: 'private',
  })(params)

export const setMyAgora = (uuid: string) =>
  api({
    method: 'POST',
    path: `/api/v3/agoras/${uuid}/join`,
    requestSchema: schemas.RestSetMyAgoraRequestSchema,
    responseSchema: schemas.RestSetMyAgoraResponseSchema,
    type: 'private',
  })()

export const leavetMyAgora = (uuid: string) =>
  api({
    method: 'DELETE',
    path: `/api/v3/agoras/${uuid}/leave`,
    requestSchema: schemas.RestLeaveMyAgoraRequestSchema,
    responseSchema: schemas.RestLeaveMyAgoraResponseSchema,
    type: 'private',
  })()
