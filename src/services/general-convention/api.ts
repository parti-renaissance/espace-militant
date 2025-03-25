import * as schemas from '@/services/general-convention/schema'
import { api } from '@/utils/api'
import z from 'zod'

export const getGeneralConventions = api({
  method: 'GET',
  path: '/api/v3/general_conventions?pagination=false',
  requestSchema: z.void(),
  responseSchema: schemas.RestGetGeneralConventionsResponseSchema,
  type: 'private',
})
