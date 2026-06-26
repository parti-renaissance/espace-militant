import { z } from 'zod'

import { authInstance, publicInstance } from '@/lib/axios'
import { api } from '@/utils/api'

import * as schemas from './schema'

export const getPronostic = (props: { uuid: string }) =>
  api({
    method: 'get',
    path: `/api/v3/pronostics/${props.uuid}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetPronosticResponseSchema,
    type: 'private',
  })()

export const getCurrentPronostic = async (props: { isAuth: boolean }) => {
  const instance = props.isAuth ? authInstance : publicInstance
  const path = props.isAuth ? 'api/v3/pronostics/current' : 'api/pronostics/current'
  const response = await instance.get(path)

  if (response.status === 204) {
    return null
  }

  return schemas.RestGetPronosticResponseSchema.parse(response.data)
}

export const createPronosticParticipation = (props: { uuid: string; payload: schemas.RestPostPronosticParticipationRequest }) =>
  api({
    method: 'post',
    path: `/api/v3/pronostics/${props.uuid}/participants`,
    requestSchema: schemas.RestPostPronosticParticipationRequestSchema,
    responseSchema: z.any(),
    type: 'private',
  })(props.payload)
