import { Platform } from 'react-native'
import * as Sentry from '@sentry/react-native'

import clientEnv from '@/config/clientEnv'

/**
 * RE-4964 TEMP AUTH DEBUG — remove after QA investigation.
 * Grep: `RE-4964 TEMP AUTH DEBUG` or `authDebugTrace`
 *
 * Staging-only: accumulates auth flow steps in memory, then sends ONE Sentry event
 * with the full trace when the flow completes. Never pass tokens/codes in `extra`.
 */

type AuthTraceStep = {
  step: string
  offsetMs: number
  extra?: Record<string, unknown>
}

type ActiveTrace = {
  id: string
  platform: string
  startedAt: number
  steps: AuthTraceStep[]
}

let activeTrace: ActiveTrace | null = null

const isEnabled = () => clientEnv.ENVIRONMENT === 'staging'

const ensureTrace = (): ActiveTrace => {
  if (!activeTrace) {
    activeTrace = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      platform: Platform.OS,
      startedAt: Date.now(),
      steps: [],
    }
  }
  return activeTrace
}

/** Append a step to the in-memory auth trace (no Sentry event). */
export const authDebugTraceStep = (step: string, extra?: Record<string, unknown>) => {
  if (!isEnabled()) return

  const trace = ensureTrace()
  const offsetMs = Date.now() - trace.startedAt
  trace.steps.push({ step, offsetMs, ...(extra ? { extra } : {}) })

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[RE-4964 auth trace +${offsetMs}ms]`, step, extra ?? '')
  }
}

/** Flush the accumulated trace as a single Sentry event. */
export const authDebugTraceEnd = (outcome: string, extra?: Record<string, unknown>) => {
  if (!isEnabled() || !activeTrace) return

  const trace = activeTrace
  activeTrace = null
  const durationMs = Date.now() - trace.startedAt

  const payload = {
    traceId: trace.id,
    platform: trace.platform,
    outcome,
    durationMs,
    stepCount: trace.steps.length,
    steps: trace.steps,
    ...extra,
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[RE-4964 auth trace END]', payload)
    return
  }

  Sentry.withScope((scope) => {
    scope.setTag('ticket', 'RE-4964')
    scope.setTag('temporary', 'true')
    scope.setTag('domain', 'auth')
    scope.setTag('auth_outcome', outcome)
    scope.setContext('auth_trace', payload)
    scope.setFingerprint(['re-4964-auth-trace', outcome])
    Sentry.captureMessage(`Auth trace RE-4964: ${outcome}`, { level: 'warning' })
  })
}
