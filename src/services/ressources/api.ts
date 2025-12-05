import * as schemas from '@/services/ressources/schema'
import { api } from '@/utils/api'

export const getRessources = (params: schemas.RestGetRessourcesRequest = {}) =>
  api({
    method: 'GET',
    path: '/api/v3/jecoute/resource-links',
    requestSchema: schemas.RestGetRessourcesRequestSchema,
    responseSchema: schemas.RestGetRessourcesResponseSchema,
    type: 'private',
  })(params)
