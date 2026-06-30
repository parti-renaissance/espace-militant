const STATE_PREFIX = 'RE1.'
const VERIFIER_KEY = 'pkce_code_verifier'
const keyedVerifierKey = (nonce: string) => `${VERIFIER_KEY}:${nonce}`

const STATE_RE = /^RE1\.([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(.*)$/

export const createNonce = (): string => crypto.randomUUID()

export const buildWebAuthState = (nonce: string, redirectPath?: string): string => `${STATE_PREFIX}${nonce}.${redirectPath ?? ''}`

export const parseWebAuthState = (state?: string): { nonce?: string; redirectPath?: string } => {
  if (!state) return {}
  const match = STATE_RE.exec(state)
  if (!match) return { redirectPath: state }
  return { nonce: match[1], redirectPath: match[2] }
}

export const storePkceVerifier = (storage: Storage, nonce: string, verifier: string): void => {
  storage.setItem(keyedVerifierKey(nonce), verifier)
}

export const consumePkceVerifier = (storage: Storage, nonce?: string): string | undefined => {
  const key = nonce ? keyedVerifierKey(nonce) : VERIFIER_KEY
  const verifier = storage.getItem(key) ?? undefined
  if (verifier) storage.removeItem(key)
  return verifier
}

export const normalizeInternalRedirect = (path?: string): string | undefined => {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return undefined
  if (/[\\\s]/.test(path)) return undefined

  for (let i = 0; i < path.length; i++) {
    const code = path.charCodeAt(i)
    if (code <= 0x1f || code === 0x7f) return undefined
  }
  return path
}
