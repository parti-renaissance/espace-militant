import axios from 'axios'
import { ZodError } from 'zod'

import { BadRequestError, DetailedAPIError, ForbiddenError, UnauthorizedError } from '@/core/errors'
import { GenericResponseError } from '@/services/common/errors/generic-errors'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

import { ActionFormError } from './error'

const serializeError = (error: unknown): Record<string, unknown> => {
  if (error instanceof ActionFormError) {
    return { kind: 'ActionFormError', violations: error.violations }
  }
  if (error instanceof GenericResponseError) {
    return { kind: 'GenericResponseError', message: error.message }
  }
  if (error instanceof DetailedAPIError) {
    return {
      kind: error.constructor.name,
      message: error.message,
      detail: error.detail,
      title: error.title,
      status: error.status,
      key: error.key,
    }
  }
  if (error instanceof ZodError) {
    return { kind: 'ZodError', issues: error.issues }
  }
  if (error instanceof Error) {
    return { kind: error.constructor.name, message: error.message, name: error.name }
  }
  return { kind: 'unknown', value: String(error) }
}

export const logActionMutation = (step: string, data?: Record<string, unknown>) => {
  ErrorMonitor.log(`[actions] ${step}`, data)
}

export const logActionMutationError = (step: string, error: unknown, data?: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {
    ...data,
    ...serializeError(error),
  }

  if (axios.isAxiosError(error)) {
    payload.httpStatus = error.response?.status
    payload.httpData = error.response?.data
    payload.httpUrl = error.config?.url
    payload.httpMethod = error.config?.method
  }

  ErrorMonitor.log(`[actions] ${step} — error`, payload)
}

export const getActionMutationErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof GenericResponseError) {
    return error.message
  }
  if (error instanceof ActionFormError) {
    return error.violations.map((v) => `${v.propertyPath}: ${v.message}`).join('\n') || 'Un ou plusieurs champs sont invalides.'
  }
  if (error instanceof DetailedAPIError && error.detail) {
    return error.detail
  }
  if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
    return error.detail ?? error.message ?? fallback
  }
  if (error instanceof BadRequestError && error.detail) {
    return error.detail
  }
  if (error instanceof Error && error.message && error.message !== 'FormError') {
    return error.message
  }
  return fallback
}
