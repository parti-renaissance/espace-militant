import * as schemas from '@/services/adherents/schema'
import { api } from '@/utils/api'

export const getAdherents = api({
  method: 'get',
  path: '/api/v3/adherents',
  requestSchema: schemas.RestAdherentListRequestSchema,
  responseSchema: schemas.RestAdherentListResponseSchema,
  type: 'private',
})

export const getAdherentDetail = (uuid: string) =>
  api({
    method: 'get',
    path: `/api/v3/adherents/${uuid}`,
    requestSchema: schemas.RestAdherentDetailRequestSchema,
    responseSchema: schemas.RestAdherentDetailSchema,
    type: 'private',
  })

export const getAdherentSensitiveData = (uuid: string) =>
  api({
    method: 'get',
    path: `/api/v3/adherents/${uuid}/sensitive-data`,
    requestSchema: schemas.RestAdherentSensitiveRequestSchema,
    responseSchema: schemas.RestAdherentSensitiveDataSchema,
    type: 'private',
  })

export const getAdherentDonations = (uuid: string) =>
  api({
    method: 'get',
    path: `/api/v3/adherents/${uuid}/donations`,
    requestSchema: schemas.RestAdherentDonationsRequestSchema,
    responseSchema: schemas.RestAdherentDonationsResponseSchema,
    type: 'private',
  })
