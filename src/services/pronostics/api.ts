import { z } from 'zod'

import { RestAlertsResponseSchema } from '@/services/alerts/schema'
import { api } from '@/utils/api'

import * as schemas from './schema'

export const getPublicAlerts = api({
  method: 'get',
  path: 'api/alerts',
  requestSchema: z.void(),
  responseSchema: RestAlertsResponseSchema,
  type: 'public',
})

export const getPronostic = (props: { uuid: string }) =>
  api({
    method: 'get',
    path: `/api/v3/pronostics/${props.uuid}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetPronosticResponseSchema,
    type: 'private',
  })()

export const createPronosticParticipation = (props: { uuid: string; payload: schemas.RestPostPronosticParticipationRequest }) =>
  api({
    method: 'post',
    path: `/api/v3/pronostics/${props.uuid}/participants`,
    requestSchema: schemas.RestPostPronosticParticipationRequestSchema,
    responseSchema: z.any(),
    type: 'private',
  })(props.payload)
