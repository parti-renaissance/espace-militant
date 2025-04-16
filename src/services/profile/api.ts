import {
  profilChangePasswordFormErrorThrower,
  profileElectDeclarationFormErrorThrower,
  profileElectPaymentFormErrorThrower,
  profileFormErrorThrower,
} from '@/services/profile/error'
import * as schemas from '@/services/profile/schema'
import type * as Types from '@/services/profile/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

export const getProfile = api({
  method: 'GET',
  path: '/api/me',
  requestSchema: schemas.RestProfilRequestSchema,
  responseSchema: schemas.RestProfilResponseSchema,
  type: 'private',
})

export const getDetailedProfile = api({
  method: 'GET',
  path: '/api/v3/profile/me',
  requestSchema: schemas.RestDetailedProfileRequestSchema,
  responseSchema: schemas.RestDetailedProfileResponseSchema,
  type: 'private',
})

export const getUserScopes = api({
  method: 'GET',
  path: '/api/v3/profile/me/scopes',
  requestSchema: schemas.RestUserScopesRequestSchema,
  responseSchema: schemas.RestUserScopesResponseSchema,
  type: 'private',
})

export const updateProfile = (userUuid: string, request: Types.RestUpdateProfileRequest) =>
  api({
    method: 'PUT',
    path: `/api/v3/profile/${userUuid}`,
    requestSchema: schemas.RestUpdateProfileRequestSchema,
    responseSchema: schemas.RestUpdateProfileResponseSchema,
    errorThrowers: [profileFormErrorThrower],
    type: 'private',
  })(request)

export const updateNotificationSubscriptionTypes = (userUuid: string, request: Types.RestUpdateProfileRequest) =>
  api({
    method: 'PUT',
    path: `/api/v3/profile/${userUuid}`,
    requestSchema: schemas.RestUpdateProfileRequestSchema,
    responseSchema: schemas.RestUpdateProfileResponseSchema,
    errorThrowers: [profileFormErrorThrower],
    type: 'private',
  })(request)

export const removeProfile = api({
  method: 'post',
  path: '/api/v3/profile/unregister',
  requestSchema: schemas.RestRemoveProfileRequestSchema,
  responseSchema: schemas.RestRemoveProfileResponseSchema,
  type: 'private',
})

export const getDonations = api({
  method: 'GET',
  path: '/api/v3/profile/me/donations',
  requestSchema: schemas.RestDonationsRequestSchema,
  responseSchema: schemas.RestDonationsResponseSchema,
  type: 'private',
})

export const cancelDonation = api({
  method: 'POST',
  path: '/api/v3/profile/me/donations/cancel',
  requestSchema: schemas.RestCancelDonationRequestSchema,
  responseSchema: schemas.RestCancelDonationResponseSchema,
  type: 'private',
})

export const getElectedProfil = (userUuid: string) =>
  api({
    method: 'GET',
    path: `/api/v3/adherents/${userUuid}/elect`,
    requestSchema: schemas.RestElectedProfileRequestSchema,
    responseSchema: schemas.RestElectedProfileResponseSchema,
    type: 'private',
  })()

export const postElectPayment = api({
  method: 'POST',
  path: '/api/v3/profile/elect-payment',
  requestSchema: schemas.RestElectPaymentRequestSchema,
  responseSchema: schemas.RestElectPaymentResponseSchema,
  errorThrowers: [profileElectPaymentFormErrorThrower],
  type: 'private',
})

export const postElectDeclaration = api({
  method: 'POST',
  path: '/api/v3/profile/elect-declaration',
  requestSchema: schemas.RestElectDeclarationRequestSchema,
  responseSchema: schemas.RestElectDeclarationResponseSchema,
  errorThrowers: [profileElectDeclarationFormErrorThrower],
  type: 'private',
})

export const postProfilePicture = (userUuid: string, request: Types.RestPostProfilePictureRequest) => {
  return api({
    method: 'POST',
    path: `/api/v3/profile/${userUuid}/image`,
    requestSchema: schemas.RestPostProfilePictureRequestSchema,
    responseSchema: schemas.RestPostProfilePictureResponseSchema,
    type: 'private',
  })(request)
}

export const deleteProfilePicture = (userUuid: string) => {
  return api({
    method: 'DELETE',
    path: `/api/v3/profile/${userUuid}/image`,
    requestSchema: schemas.RestDeleteProfilePictureRequestSchema,
    responseSchema: schemas.RestDeleteProfilePictureResponseSchema,
    type: 'private',
  })()
}

export const getTaxReceipts = api({
  method: 'GET',
  path: `api/v3/profile/me/tax_receipts`,
  requestSchema: schemas.RestTaxReceiptsRequestSchema,
  responseSchema: schemas.RestTaxReceiptsResponseSchema,
  type: 'private',
})

export const getTaxReceiptFile = (taxReceiptUuid: string) => {
  return api({
    method: 'GET',
    path: `api/v3/profile/me/tax_receipts/${taxReceiptUuid}/file`,
    requestSchema: schemas.RestTaxReceiptFileRequestSchema,
    responseSchema: schemas.RestTaxReceiptFileResponseSchema,
    type: 'private',
    axiosConfig: {
      responseType: 'blob',
    },
  })()
}
export const postChangePassword = api({
  method: 'POST',
  path: '/api/v3/profile/me/password-change',
  requestSchema: schemas.RestChangePasswordRequestSchema,
  responseSchema: schemas.RestChangePasswordResponseSchema,
  errorThrowers: [profilChangePasswordFormErrorThrower],
  type: 'private',
})

export const getInstances = api({
  method: 'GET',
  path: '/api/v3/profile/instances',
  requestSchema: schemas.RestInstancesRequestSchema,
  responseSchema: schemas.RestInstancesResponseSchema,
  type: 'private',
})

export const logout = api({
  method: 'POST',
  path: '/api/v3/logout',
  requestSchema: z.void(),
  responseSchema: z.void(),
  type: 'private',
})
