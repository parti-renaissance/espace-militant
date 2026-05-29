import clientEnv from '@/config/clientEnv'

export const DEFAULT_SIGNUP_SOURCE = 'vox'

export const SIGNUP_RESEND_COOLDOWN_MS = 60_000

export const FRIENDLY_CAPTCHA_SITE_KEY = clientEnv.FRIENDLY_CAPTCHA_SITE_KEY?.trim() || 'FCMUUBPHUGV7VJLE'

export const FRIENDLY_CAPTCHA_API_ENDPOINT = 'eu' as const

export const FRIENDLY_CAPTCHA_SDK_VERSION = '0.2.3'
