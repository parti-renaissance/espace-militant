import { isAxiosError } from 'axios'
import type { FieldPath, UseFormSetError } from 'react-hook-form'

import { isPathExist } from '@/services/common/errors/utils'
import { SignupFormError } from '@/services/signup/error'
import type { SignupInscriptionFormValues } from '@/services/signup/schema'

const GENERIC_VALIDATION_MESSAGES = new Set(['Validation Failed', 'validation failed'])

export function getSignupErrorMessage(error: unknown, fallback = 'Une erreur est survenue. Veuillez réessayer.'): string {
  if (error instanceof SignupFormError) {
    return error.violations.map((v) => v.message).join('\n')
  }

  if (isAxiosError(error)) {
    const status = error.response?.status
    if (status === 429) {
      return 'Trop de tentatives. Veuillez patienter une minute avant de réessayer.'
    }
    if (status === 400) {
      const data = error.response?.data as { message?: string; detail?: string } | undefined
      if (typeof data?.detail === 'string') return data.detail
      if (typeof data?.message === 'string' && !GENERIC_VALIDATION_MESSAGES.has(data.message)) {
        return data.message
      }
      return fallback
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function applySignupFormError(options: {
  error: unknown
  setError: UseFormSetError<SignupInscriptionFormValues>
  setRecaptchaError: (message: string | null) => void
  setFormError: (message: string | null) => void
  fallback?: string
}) {
  const { error, setError, setRecaptchaError, setFormError, fallback } = options

  setRecaptchaError(null)
  setFormError(null)

  if (!(error instanceof SignupFormError)) {
    setFormError(getSignupErrorMessage(error, fallback))
    return
  }

  const unmapped: string[] = []

  for (const violation of error.violations) {
    if (violation.propertyPath === 'recaptcha') {
      setRecaptchaError(violation.message)
      continue
    }
    if (isPathExist(violation.propertyPath, { first_name: '', email: '', postal_code: '', email_opt_in: false })) {
      setError(violation.propertyPath as FieldPath<SignupInscriptionFormValues>, { message: violation.message })
      continue
    }
    unmapped.push(violation.message)
  }

  if (unmapped.length > 0) {
    setFormError(unmapped.join('\n'))
  }
}
