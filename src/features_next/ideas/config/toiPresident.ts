import clientEnv from '@/config/clientEnv'

export const UUID_PARAM = 'uuid'
export const TOI_PRESIDENT_SHARE_MESSAGE = 'Toi président — le jeu'

const EMBED_URL = clientEnv.TOI_PRESIDENT_EMBED_URL ?? ''
const SHARE_URL = clientEnv.TOI_PRESIDENT_SHARE_URL || EMBED_URL

export const ALLOWED_ORIGINS: string[] = (() => {
  try {
    return [new URL(EMBED_URL).origin]
  } catch {
    return []
  }
})()

export function getToiPresidentEmbedUrl(uuid?: string | null): string {
  if (!EMBED_URL || !uuid) return EMBED_URL
  try {
    const url = new URL(EMBED_URL)
    url.searchParams.set(UUID_PARAM, uuid)
    return url.toString()
  } catch {
    const separator = EMBED_URL.includes('?') ? '&' : '?'
    return `${EMBED_URL}${separator}${UUID_PARAM}=${encodeURIComponent(uuid)}`
  }
}

export function getToiPresidentShareUrl(): string {
  return SHARE_URL
}
