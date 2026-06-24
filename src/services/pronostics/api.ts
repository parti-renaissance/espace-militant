import { z } from 'zod'

import { api } from '@/utils/api'

import * as schemas from './schema'

export const createPronosticParticipation = (props: { uuid: string; payload: schemas.RestCreatePronosticParticipationRequest }) =>
  api({
    method: 'post',
    path: `/api/v3/pronostics/${props.uuid}/participants`,
    requestSchema: schemas.RestCreatePronosticParticipationRequestSchema,
    responseSchema: z.any(),
    type: 'private',
  })(props.payload)
