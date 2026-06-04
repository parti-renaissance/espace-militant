import { useMutation } from '@tanstack/react-query'

import { postSignup, postSignupActivate, postSignupResendCode } from '@/services/signup/api'
import type {
  RestPostSignupActivateRequest,
  RestPostSignupRequest,
  RestPostSignupResendCodeRequest,
} from '@/services/signup/schema'

export function useSignup() {
  return useMutation({
    mutationFn: (payload: RestPostSignupRequest) => postSignup(payload),
  })
}

export function useActivateSignup() {
  return useMutation({
    mutationFn: (payload: RestPostSignupActivateRequest) => postSignupActivate(payload),
  })
}

export function useResendSignupCode() {
  return useMutation({
    mutationFn: (payload: RestPostSignupResendCodeRequest) => postSignupResendCode(payload),
  })
}
