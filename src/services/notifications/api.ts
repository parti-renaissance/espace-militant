import * as schemas from '@/services/notifications/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

export const getNotificationList = api({
  method: 'GET',
  path: '/api/v3/subscription_types',
  requestSchema: schemas.RestSubscriptionTypesRequestSchema,
  responseSchema: schemas.RestSubscriptionTypeResponseSchema,
  type: 'private',
})

export const unsubscribe = api({
  method: 'POST',
  path: '/api/v3/profile/unsubscribe',
  requestSchema: z.void(),
  responseSchema: z.void(),
  type: 'private',
})

export const getReSubscribeConfig = api({
  method: 'GET',
  path: '/api/v3/resubscribe-config',
  requestSchema: schemas.RestReSubscribeConfigRequestSchema,
  responseSchema: schemas.RestReSubscribeConfigResponseSchema,
  type: 'private',
})
