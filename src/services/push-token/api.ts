import * as schemas from '@/services/push-token/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

export const addPushToken = api({
  method: 'post',
  path: '/api/v3/push-token',
  requestSchema: schemas.RestPostPushTokenRequestSchema,
  responseSchema: schemas.RestPostPushTokenResponseSchema,
  type: 'private',
})

export const removePushToken = api({
  method: 'post',
  path: '/api/v3/push-token/unsubscribe',
  requestSchema: z.void(),
  responseSchema: z.any(),
  type: 'private',
})
