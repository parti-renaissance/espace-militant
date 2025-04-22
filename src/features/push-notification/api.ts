import * as schemas from '@/features/push-notification/schema'
import { api } from '@/utils/api'

export const addPushToken = api({
  method: 'post',
  path: '/api/v3/push-token',
  requestSchema: schemas.RestPostPushTokenRequestSchema,
  responseSchema: schemas.RestPostPushTokenResponseSchema,
  type: 'private',
})

export const removePushToken = api({
  method: 'delete',
  path: '/api/v3/push-token',
  requestSchema: schemas.RestPostPushTokenRequestSchema,
  responseSchema: schemas.RestPostPushTokenResponseSchema,
  type: 'private',
})
