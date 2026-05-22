import i18next from 'i18next'

import type { BotChatError } from '../schema'

export function classifyHttpError(status: number, retryAfterHeader: string | null): BotChatError {
  const retryAfterRaw = retryAfterHeader ? parseInt(retryAfterHeader, 10) : NaN
  const retryAfterSeconds = Number.isFinite(retryAfterRaw) && retryAfterRaw > 0 ? retryAfterRaw : undefined

  if (status === 401) {
    return { kind: 'auth', message: i18next.t('bot.errors.auth'), retryable: false }
  }
  if (status === 403) {
    return { kind: 'forbidden', message: i18next.t('bot.errors.forbidden'), retryable: false }
  }
  if (status === 429) {
    return {
      kind: 'quota',
      message: retryAfterSeconds ? i18next.t('bot.errors.quotaWithDelay', { seconds: retryAfterSeconds }) : i18next.t('bot.errors.quota'),
      retryable: true,
      retryAfterSeconds,
    }
  }
  if (status >= 500) {
    return { kind: 'serviceDown', message: i18next.t('bot.errors.serviceDown'), retryable: true }
  }
  return { kind: 'unknown', message: i18next.t('bot.errors.unknown'), retryable: true }
}
