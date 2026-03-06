import * as schemas from '@/services/adherents/schema'
import { api } from '@/utils/api'

export const getAdherents = api({
  method: 'get',
  path: '/api/v3/adherents',
  requestSchema: schemas.RestAdherentListRequestSchema,
  responseSchema: schemas.RestAdherentListResponseSchema,
  type: 'private',
})
