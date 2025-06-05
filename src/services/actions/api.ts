import { api } from '@/utils/api'
import { z } from 'zod'
import { actionFormErrorThrower } from './error'
import { mapParams } from './paramsMapper'
import * as schema from './schema'

export const getActions = (params: schema.RestActionRequestParams) =>
  api({ method: 'get', path: 'api/v3/actions', requestSchema: schema.RestGetActionsRequestSchema, responseSchema: schema.ActionPaginationSchema })(
    mapParams(params),
  )

export const insertAction = (payload: schema.ActionCreateType, scope?: string) => {
  return api({
    method: 'post',
    path: `api/v3/actions?scope=${scope}`,
    requestSchema: schema.ActionCreateSchema,
    responseSchema: schema.ActionFullSchema,
    errorThrowers: [actionFormErrorThrower],
  })(payload)
}

export const editAction = (uuid: string, payload: schema.ActionCreateType, scope?: string) => {
  return api({
    method: 'put',
    path: `api/v3/actions/${uuid}?scope=${scope}`,
    requestSchema: schema.ActionCreateSchema,
    responseSchema: schema.ActionFullSchema,
    errorThrowers: [actionFormErrorThrower],
  })(payload)
}

export const getAction = (id: string, scope?: string) => {
  return api({ method: 'get', path: `api/v3/actions/${id}?scope=${scope}`, responseSchema: schema.ActionFullSchema, requestSchema: z.void() })()
}

export const subscribeToAction = (id: string) => {
  return api({ method: 'post', path: `api/v3/actions/${id}/register`, requestSchema: z.void(), responseSchema: z.any() })()
}

export const unsubscribeFromAction = (id: string) => {
  return api({ method: 'delete', path: `api/v3/actions/${id}/register`, requestSchema: z.void(), responseSchema: z.any() })()
}

export const cancelAction = (uuid: string, scope?: string) => {
  return api({ method: 'put', path: `api/v3/actions/${uuid}/cancel?scope=${scope}`, requestSchema: z.void(), responseSchema: z.any() })()
}