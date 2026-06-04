import { api } from '@/utils/api'
import { z } from 'zod'

import { actionFormErrorThrower } from './error'
import * as schemas from './schema'

export const getAction = (request: schemas.RestGetActionRequest) =>
  api({
    method: 'get',
    path: `/api/v3/actions/${request.id}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetActionResponseSchema,
    type: 'private',
  })()

export const createAction = (payload: schemas.RestPostActionRequest) =>
  api({
    method: 'post',
    path: '/api/v3/actions',
    requestSchema: schemas.RestPostActionRequestSchema,
    responseSchema: schemas.RestPostActionResponseSchema,
    errorThrowers: [actionFormErrorThrower],
    skipGenericErrorLog: true,
    type: 'private',
  })(payload)

export const updateAction = (props: { id: string; payload: schemas.RestPutActionRequest }) =>
  api({
    method: 'put',
    path: `/api/v3/actions/${props.id}`,
    requestSchema: schemas.RestPutActionRequestSchema,
    responseSchema: schemas.RestPutActionResponseSchema,
    errorThrowers: [actionFormErrorThrower],
    skipGenericErrorLog: true,
    type: 'private',
  })(props.payload)

export const cancelAction = (request: schemas.RestPutActionCancelRequest) =>
  api({
    method: 'put',
    path: `/api/v3/actions/${request.id}/cancel`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    skipGenericErrorLog: true,
    type: 'private',
  })()

export const subscribeToAction = (id: string) =>
  api({
    method: 'post',
    path: `/api/v3/actions/${id}/register`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    skipGenericErrorLog: true,
    type: 'private',
  })()

export const unsubscribeFromAction = (id: string) =>
  api({
    method: 'delete',
    path: `/api/v3/actions/${id}/register`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    skipGenericErrorLog: true,
    type: 'private',
  })()
