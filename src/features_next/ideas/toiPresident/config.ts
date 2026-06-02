import clientEnv from '@/config/clientEnv'

export const UUID_PARAM = 'uuid'
export const SHARE_URL_PARAM = 'share_url'
export const TOI_PRESIDENT_SHARE_MESSAGE = 'Toi président — le jeu'
export const TOI_PRESIDENT_PATH = '/idees/toi-president'

const EMBED_URL = clientEnv.TOI_PRESIDENT_EMBED_URL ?? ''
const SHARE_URL = clientEnv.TOI_PRESIDENT_SHARE_URL ?? ''

export const ALLOWED_ORIGINS: string[] = (() => {
  try {
    return [new URL(EMBED_URL).origin]
  } catch {
    return []
  }
})()

export function getToiPresidentEmbedUrl(uuid?: string | null): string {
  if (!EMBED_URL) return EMBED_URL
  try {
    const url = new URL(EMBED_URL)
    if (uuid) url.searchParams.set(UUID_PARAM, uuid)
    url.searchParams.set(SHARE_URL_PARAM, getToiPresidentShareUrl())
    return url.toString()
  } catch {
    const params = new URLSearchParams()
    if (uuid) params.set(UUID_PARAM, uuid)
    params.set(SHARE_URL_PARAM, getToiPresidentShareUrl())
    const separator = EMBED_URL.includes('?') ? '&' : '?'
    return `${EMBED_URL}${separator}${params.toString()}`
  }
}

export function getToiPresidentShareUrl(): string {
  if (SHARE_URL) return SHARE_URL
  return `https://${clientEnv.ASSOCIATED_DOMAIN}${TOI_PRESIDENT_PATH}`
}
