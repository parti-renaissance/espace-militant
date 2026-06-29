import { api } from '@/utils/api'
import * as schema from './schema'

export const getAlerts = api({
  path: 'api/v3/alerts',
  method: 'GET',
  requestSchema: schema.RestAlertsRequestSchema,
  responseSchema: schema.RestAlertsResponseSchema,
  type: 'private',
})

export const getPublicAlerts = api({
  path: 'api/alerts',
  method: 'GET',
  requestSchema: schema.RestAlertsRequestSchema,
  responseSchema: schema.RestAlertsResponseSchema,
  type: 'public',
})
