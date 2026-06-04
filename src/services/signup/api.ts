import { SignupFormErrorThrower } from '@/services/signup/error'
import * as schemas from '@/services/signup/schema'
import { api } from '@/utils/api'

export const signupServiceKey = 'signup'

export const postSignup = (payload: schemas.RestPostSignupRequest) =>
  api({
    method: 'post',
    path: '/api/signup',
    requestSchema: schemas.RestPostSignupRequestSchema,
    responseSchema: schemas.RestPostSignupResponseSchema,
    type: 'public',
    errorThrowers: [SignupFormErrorThrower],
  })(payload)

export const postSignupActivate = (payload: schemas.RestPostSignupActivateRequest) =>
  api({
    method: 'post',
    path: '/api/signup/activate',
    requestSchema: schemas.RestPostSignupActivateRequestSchema,
    responseSchema: schemas.RestPostSignupActivateResponseSchema,
    type: 'public',
  })(payload)

export const postSignupResendCode = (payload: schemas.RestPostSignupResendCodeRequest) =>
  api({
    method: 'post',
    path: '/api/signup/resend-code',
    requestSchema: schemas.RestPostSignupResendCodeRequestSchema,
    responseSchema: schemas.RestPostSignupResendCodeResponseSchema,
    type: 'public',
  })(payload)
