import { isRunningInExpoGo } from 'expo'
import * as Sentry from '@sentry/react-native'
import type { ErrorEvent } from '@sentry/react-native'

import clientEnv from '@/config/clientEnv'

const IGNORED_ERROR_PATTERNS = [
  'messaging/unsupported-browser',
  'ExpoWebBrowser.warmUpAsync',
  'The refresh token is invalid',
  'invalid_grant',
]

const getEventText = (event: ErrorEvent): string => {
  const message = event.message ?? ''
  const ex = event.exception?.values?.[0]
  const type = ex?.type ?? ''
  const value = ex?.value ?? ''
  return `${type}: ${value} ${message}`.toLowerCase()
}

/** Tags for automatic / legacy events only (beforeSend). Prefer `logError({ domain })` at call sites. */
const inferLegacyDomainTag = (message: string): string | undefined => {
  if (message.includes('[NetworkLogger]')) return 'network'
  if (message.includes('TokenRefresh') || message.toLowerCase().includes('refresh token')) return 'auth'
  if (message.includes('[UI]')) return 'ui'
  return undefined
}

export type ErrorMonitorLogErrorParams = {
  message: string
  domain?: string
  tags?: Record<string, string>
  error?: unknown
  extra?: Record<string, unknown>
}

const shouldDropEvent = (event: ErrorEvent): boolean => {
  const text = getEventText(event)
  const ex = event.exception?.values?.[0]

  if (text.includes('unsupported-browser')) return true
  if (text.includes('warmupasync')) return true
  if (text.includes('refresh token') && text.includes('invalid')) return true
  if (text.includes('invalid_grant')) return true

  if (ex?.type === 'AxiosError' && ex?.value === 'Network Error') return true

  const level = event.level ?? 'info'
  if (level === 'info' || level === 'log') {
    const message = event.message ?? ''
    if (message === 'log' || message.startsWith('[')) return true
  }

  return false
}

const enrichEvent = (event: ErrorEvent): ErrorEvent => {
  if (event.tags?.domain) {
    return event
  }

  const message = event.message ?? event.exception?.values?.[0]?.value ?? ''
  const domain = inferLegacyDomainTag(message)

  if (domain) {
    event.tags = { ...event.tags, domain }
  }

  return event
}

export const ErrorMonitor = {
  configure: () => {
    const navigationIntegration = Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: !isRunningInExpoGo(),
    })

    Sentry.init({
      dsn: clientEnv.SENTRY_DSN,
      environment: clientEnv.ENVIRONMENT,
      enabled: !__DEV__,
      integrations: [navigationIntegration],
      enableNativeFramesTracking: !isRunningInExpoGo(),
      ignoreErrors: IGNORED_ERROR_PATTERNS,
      beforeSend(event) {
        if (shouldDropEvent(event)) {
          return null
        }
        return enrichEvent(event)
      },
    })
    return { navigationIntegration }
  },
  /**
   * Legacy error reporting. Prefer `logError` for new call sites.
   * Sends to Sentry in production with level `warning` (not filtered by beforeSend).
   */
  log: (message: string, payload?: Record<string, unknown>) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[ErrorMonitor]', message, payload)
      return
    }

    const error =
      payload?.error instanceof Error
        ? payload.error
        : payload?.e instanceof Error
          ? payload.e
          : undefined

    if (error) {
      Sentry.captureException(error, {
        level: 'warning',
        extra: { ...payload, logMessage: message },
      })
    } else {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: payload,
      })
    }
  },
  /** Production error reporting with level `error` and optional exception stack. */
  logError: ({ message, domain, tags: customTags, error, extra }: ErrorMonitorLogErrorParams) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[ErrorMonitor]', { message, domain, tags: customTags, error, extra })
      return
    }

    const tags =
      domain || customTags ? { ...customTags, ...(domain ? { domain } : {}) } : undefined

    if (error instanceof Error) {
      Sentry.captureException(error, {
        level: 'error',
        tags,
        extra: { ...extra, logMessage: message },
      })
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        tags,
        extra: extra,
      })
    }
  },
  wrap: (RootComponent: React.ComponentType<Record<string, unknown>>) => {
    return Sentry.wrap(RootComponent)
  },
}
