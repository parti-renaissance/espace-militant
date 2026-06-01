import { isAxiosError } from 'axios'
import type { FieldPath, UseFormSetError } from 'react-hook-form'

const GENERIC_VALIDATION_MESSAGES = new Set(['Validation Failed', 'validation failed'])

export type SignupViolation = {
  propertyPath: string
  message: string
}

export function parseSignupViolations(error: unknown): SignupViolation[] {
  if (!isAxiosError(error)) return []

  const data = error.response?.data
  if (!data || typeof data !== 'object' || !('violations' in data)) return []

  const violations = (data as { violations: unknown }).violations
  if (!Array.isArray(violations)) return []

  return violations
    .filter((v): v is SignupViolation => {
      return (
        typeof v === 'object' &&
        v !== null &&
        typeof (v as SignupViolation).propertyPath === 'string' &&
        typeof (v as SignupViolation).message === 'string'
      )
    })
    .map((v) => ({
      propertyPath: v.propertyPath,
      message: v.message,
    }))
}

export function getSignupViolationMessage(violations: SignupViolation[], propertyPath: string): string | undefined {
  return violations.find((v) => v.propertyPath === propertyPath)?.message
}

const SIGNUP_FORM_FIELDS = ['first_name', 'email', 'postal_code'] as const
type SignupFormField = (typeof SIGNUP_FORM_FIELDS)[number]

function isSignupFormField(path: string): path is SignupFormField {
  return (SIGNUP_FORM_FIELDS as readonly string[]).includes(path)
}

export function getSignupErrorMessage(error: unknown, fallback = 'Une erreur est survenue. Veuillez réessayer.'): string {
  const violations = parseSignupViolations(error)
  if (violations.length > 0) {
    return violations.map((v) => v.message).join('\n')
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

export function applySignupViolationsToForm<T extends Record<string, unknown>>(options: {
  error: unknown
  setError: UseFormSetError<T>
  setRecaptchaError: (message: string | null) => void
  setFormError: (message: string | null) => void
  fallback?: string
}) {
  const { error, setError, setRecaptchaError, setFormError, fallback } = options
  const violations = parseSignupViolations(error)

  setRecaptchaError(null)
  setFormError(null)

  if (violations.length === 0) {
    setFormError(getSignupErrorMessage(error, fallback))
    return
  }

  const unmapped: string[] = []

  for (const violation of violations) {
    if (violation.propertyPath === 'recaptcha') {
      setRecaptchaError(violation.message)
      continue
    }
    if (isSignupFormField(violation.propertyPath)) {
      setError(violation.propertyPath as FieldPath<T>, { message: violation.message })
      continue
    }
    unmapped.push(violation.message)
  }

  if (unmapped.length > 0) {
    setFormError(unmapped.join('\n'))
  }
}
