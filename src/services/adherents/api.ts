import { formErrorThrower } from '@/services/common/errors/form-errors'
import * as schemas from '@/services/adherents/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

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

export const getAdherentElect = (uuid: string) =>
  api({
    method: 'get',
    path: `/api/v3/adherents/${uuid}/elect`,
    requestSchema: schemas.RestAdherentElectRequestSchema,
    responseSchema: schemas.RestAdherentElectResponseSchema,
    type: 'private',
  })

export const putAdherentElectExemptFromCotisation = (props: {
  uuid: string
  scope: string
  payload: schemas.RestAdherentElectToggleExemptPayload
}) =>
  api({
    method: 'put',
    path: `/api/v3/adherents/${props.uuid}/elect?scope=${props.scope}`,
    requestSchema: schemas.RestAdherentElectToggleExemptPayloadSchema,
    responseSchema: schemas.RestAdherentElectResponseSchema,
    errorThrowers: [(error: unknown) => formErrorThrower(error)],
    type: 'private',
  })(props.payload)

type PostAdherentElectMandateProps = {
  scope: string
  payload: schemas.RestAdherentElectMandateUpsertPayload
}

type PutAdherentElectMandateProps = PostAdherentElectMandateProps & {
  mandateUuid: string
}

export const postAdherentElectMandate = (props: PostAdherentElectMandateProps) =>
  api({
    method: 'post',
    path: `/api/v3/elected_adherent_mandates?scope=${props.scope}`,
    requestSchema: schemas.RestAdherentElectMandateUpsertPayloadSchema,
    responseSchema: schemas.RestAdherentElectMandateUpsertResponseSchema,
    type: 'private',
  })(props.payload)

export const putAdherentElectMandate = (props: PutAdherentElectMandateProps) =>
  api({
    method: 'put',
    path: `/api/v3/elected_adherent_mandates/${props.mandateUuid}?scope=${props.scope}`,
    requestSchema: schemas.RestAdherentElectMandateUpsertPayloadSchema,
    responseSchema: schemas.RestAdherentElectMandateUpsertResponseSchema,
    type: 'private',
  })(props.payload)

export const deleteAdherentElectMandate = (props: { mandateUuid: string; scope: string }) =>
  api({
    method: 'delete',
    path: `/api/v3/elected_adherent_mandates/${props.mandateUuid}?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    type: 'private',
  })()
