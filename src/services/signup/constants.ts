import clientEnv from '@/config/clientEnv'

export const DEFAULT_SIGNUP_SOURCE = 'vox'

/** UUID vidéo de bienvenue du tunnel signup. */
export const SIGNUP_BIENVENUE_VIDEO_UUID = '550e8400-e29b-41d4-a716-446655440001'

export const SIGNUP_RESEND_COOLDOWN_MS = 60_000

export const FRIENDLY_CAPTCHA_SITE_KEY = clientEnv.FRIENDLY_CAPTCHA_SITE_KEY?.trim() || 'FCMUUBPHUGV7VJLE'

export const FRIENDLY_CAPTCHA_API_ENDPOINT = 'eu' as const

export const FRIENDLY_CAPTCHA_SDK_VERSION = '0.2.3'
