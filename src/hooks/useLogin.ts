import { useEffect, useState } from 'react'
import * as AuthSession from 'expo-auth-session'
import { DiscoveryDocument } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { maybeCompleteAuthSession } from 'expo-web-browser'
import { isWeb } from 'tamagui'

import clientEnv from '@/config/clientEnv'
import { AUTHORIZATION_ENDPOINT, getDiscoveryDocument, REGISTRATION_ENDPOINT } from '@/config/discoveryDocument'
import type { User } from '@/store/user-store'

import useBrowserWarmUp from './useBrowserWarmUp'

const STABILIZATION_DELAY_MS = 150

export const waitForUiStabilization = () => new Promise<void>((resolve) => setTimeout(resolve, STABILIZATION_DELAY_MS))

export const safelyDismissAuthSession = async () => {
  try {
    await WebBrowser.dismissAuthSession()
  } catch {
    // No auth session to dismiss or already closed by native browser hand-off.
  }
  try {
    await WebBrowser.dismissBrowser()
  } catch {
    // Browser can already be closed depending on iOS hand-off timing.
  }
  await waitForUiStabilization()
}

export class AuthFlowError extends Error {
  details?: unknown

  constructor(message: string, details?: unknown) {
    super(message)
    this.name = 'AuthFlowError'
    this.details = details
  }
}

try {
  maybeCompleteAuthSession()
} catch {
  // Can throw on native when there is no browser session to complete.
}

export const REDIRECT_URI = AuthSession.makeRedirectUri()
const BASE_REQUEST_CONFIG = { clientId: clientEnv.OAUTH_CLIENT_ID, redirectUri: REDIRECT_URI }
const PKCE_VERIFIER_STORAGE_KEY = 'pkce_code_verifier'

const storePkceVerifier = (verifier?: string) => {
  if (isWeb && typeof window !== 'undefined' && verifier) {
    window.sessionStorage.setItem(PKCE_VERIFIER_STORAGE_KEY, verifier)
  }
}

const consumePkceVerifier = (): string | undefined => {
  if (!isWeb || typeof window === 'undefined') {
    return undefined
  }
  const verifier = window.sessionStorage.getItem(PKCE_VERIFIER_STORAGE_KEY) ?? undefined
  if (verifier) {
    window.sessionStorage.removeItem(PKCE_VERIFIER_STORAGE_KEY)
  }
  return verifier
}

export const useDiscoveryDocument = (register?: boolean) => {
  const [discovery, setDiscovery] = useState<DiscoveryDocument | null>(null)

  useEffect(() => {
    const load = async () => {
      const doc = register ? { authorizationEndpoint: REGISTRATION_ENDPOINT } : await getDiscoveryDocument()
      setDiscovery(doc)
    }

    load()
  }, [register])

  return discovery
}

export const useCodeAuthRequest = (props?: { register?: boolean; utm_campaign?: string }) => {
  const discovery = useDiscoveryDocument(props?.register)

  const requestConfig = {
    ...BASE_REQUEST_CONFIG,
    scopes: ['jemarche_app', 'read:profile', 'write:profile'],
    usePKCE: true,
    extraParams: {
      utm_source: 'app',
      ...(props?.utm_campaign ? { utm_campaign: props.utm_campaign } : {}),
    },
  }

  return AuthSession.useAuthRequest(requestConfig, discovery)
}

export const exchangeCodeAsync = async ({ code, sessionId, codeVerifier }: { code: string; sessionId?: string; codeVerifier?: string }) => {
  if (!code) {
    return null
  }

  return AuthSession.exchangeCodeAsync(
    {
      ...BASE_REQUEST_CONFIG,
      code,
      extraParams: { session_id: sessionId ?? '', ...(codeVerifier ? { code_verifier: codeVerifier } : {}) },
    },
    await getDiscoveryDocument(),
  )
}

type ExchangedSession = NonNullable<Awaited<ReturnType<typeof exchangeCodeAsync>>>

// Maps an OAuth token-exchange response to the user-store credentials shape.
// Shared by the login (SessionProvider) and signup-activation flows.
export const credentialsFromTokenResponse = (session: ExchangedSession, isAdmin?: boolean): User => ({
  accessToken: session.accessToken,
  refreshToken: session.refreshToken,
  sessionId: session.idToken,
  accessTokenExpiresIn: session.expiresIn,
  isAdmin,
})

export const createPkcePair = async (): Promise<{ codeChallenge: string; codeVerifier: string }> => {
  const request = new AuthSession.AuthRequest({ ...BASE_REQUEST_CONFIG, usePKCE: true })
  await request.getAuthRequestConfigAsync()
  if (!request.codeChallenge || !request.codeVerifier) {
    throw new AuthFlowError('Failed to generate a PKCE pair')
  }
  return { codeChallenge: request.codeChallenge, codeVerifier: request.codeVerifier }
}

export const useLogin = () => {
  useBrowserWarmUp()
  const [req, , promptAsync] = useCodeAuthRequest() ?? []
  return async (payload?: { code?: string; sessionId?: string; state?: string }) => {
    if (payload?.code) {
      await safelyDismissAuthSession()
      const codeVerifier = isWeb ? consumePkceVerifier() : req?.codeVerifier
      return exchangeCodeAsync({ code: payload.code, sessionId: payload.sessionId, codeVerifier })
    }

    if (isWeb) {
      const url = new URL(AUTHORIZATION_ENDPOINT)
      url.searchParams.set('redirect_uri', req?.redirectUri ?? '')
      url.searchParams.set('client_id', req?.clientId ?? '')
      url.searchParams.set('response_type', 'code')
      if (req?.codeChallenge) {
        url.searchParams.set('code_challenge', req.codeChallenge)
        url.searchParams.set('code_challenge_method', 'S256')
        storePkceVerifier(req.codeVerifier)
      }
      if (payload?.state) {
        url.searchParams.set('state', payload?.state)
      }
      req?.scopes!.forEach((scope) => url.searchParams.append('scope[]', scope))
      Object.entries(req?.extraParams ?? {}).forEach(([key, value]) => url.searchParams.set(key, value))
      window.location.href = url.toString()
      return null
    }

    try {
      const codeResult = await promptAsync({
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.CURRENT_CONTEXT,
        createTask: false,
      })

      if (codeResult.type === 'success') {
        const session = await exchangeCodeAsync({ code: codeResult.params.code, codeVerifier: req?.codeVerifier })
        await waitForUiStabilization()
        return session
      }

      if (codeResult.type === 'cancel' || codeResult.type === 'dismiss') {
        await waitForUiStabilization()
        return null
      }

      throw new AuthFlowError('Unexpected login auth result', codeResult)
    } catch (error) {
      if (error instanceof AuthFlowError) throw error
      throw new AuthFlowError('Technical login failure', error)
    }
  }
}

export const useRegister = () => {
  useBrowserWarmUp()
  const [req, , promptAsync] = useCodeAuthRequest({ register: true }) ?? []
  return async ({ utm_campaign }: { utm_campaign?: string } = {}) => {
    if (isWeb) {
      let url = REGISTRATION_ENDPOINT + `?redirect_uri=${REDIRECT_URI}&utm_source=app`
      if (req?.codeChallenge) {
        url += `&code_challenge=${encodeURIComponent(req.codeChallenge)}&code_challenge_method=S256`
        storePkceVerifier(req.codeVerifier)
      }
      if (utm_campaign) {
        url += `&utm_campaign=${encodeURIComponent(utm_campaign)}`
      }
      window.location.href = url
      return null
    }

    const codeResult = await promptAsync({ createTask: false })

    try {
      if (codeResult.type === 'success') {
        const session = await exchangeCodeAsync({ code: codeResult.params.code, codeVerifier: req?.codeVerifier })
        await waitForUiStabilization()
        return session
      }

      if (codeResult.type === 'cancel' || codeResult.type === 'dismiss') {
        await waitForUiStabilization()
        return null
      }

      throw new AuthFlowError('Unexpected registration auth result', codeResult)
    } catch (error) {
      throw new AuthFlowError('Technical registration failure', error)
    }
  }
}

export default useLogin
