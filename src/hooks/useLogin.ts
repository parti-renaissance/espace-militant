import { useEffect, useState } from 'react'
import clientEnv from '@/config/clientEnv'
import { AUTHORIZATION_ENDPOINT, getDiscoveryDocument, REGISTRATION_ENDPOINT } from '@/config/discoveryDocument'
import * as AuthSession from 'expo-auth-session'
import { DiscoveryDocument } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { maybeCompleteAuthSession } from 'expo-web-browser'
import { isWeb } from 'tamagui'
import useBrowserWarmUp from './useBrowserWarmUp'

maybeCompleteAuthSession()

export const REDIRECT_URI = AuthSession.makeRedirectUri()
const BASE_REQUEST_CONFIG = { clientId: clientEnv.OAUTH_CLIENT_ID, redirectUri: REDIRECT_URI }

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

export const useCodeAuthRequest = (props?: { register?: boolean }) => {
  const discovery = useDiscoveryDocument(props?.register)

  const requestConfig = {
    ...BASE_REQUEST_CONFIG,
    scopes: ['jemarche_app', 'read:profile', 'write:profile'],
    usePKCE: false,
    extraParams: {
      utm_source: 'app',
    },
  }

  return AuthSession.useAuthRequest(requestConfig, discovery)
}

const exchangeCodeAsync = async ({ code }: { code: string }) => {
  if (!code) return null

  return AuthSession.exchangeCodeAsync({ ...BASE_REQUEST_CONFIG, code }, await getDiscoveryDocument())
}

export const useLogin = () => {
  useBrowserWarmUp()
  const [req, , promptAsync] = useCodeAuthRequest() ?? []
  return async (payload?: { code?: string; state?: string }) => {
    if (payload?.code) {
      WebBrowser.dismissAuthSession()
      return exchangeCodeAsync({ code: payload.code })
    }

    if (isWeb) {
      const url = new URL(AUTHORIZATION_ENDPOINT)
      url.searchParams.set('redirect_uri', req?.redirectUri ?? '')
      url.searchParams.set('client_id', req?.clientId ?? '')
      url.searchParams.set('response_type', 'code')
      if (payload?.state) {
        url.searchParams.set('state', payload?.state)
      }
      req?.scopes!.forEach((scope) => url.searchParams.append('scope[]', scope))
      Object.entries(req?.extraParams ?? {}).forEach(([key, value]) => url.searchParams.set(key, value))
      window.location.href = url.toString()
      return null
    }

    return promptAsync({
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.CURRENT_CONTEXT,
      createTask: false,
    }).then((codeResult) => {
      if (codeResult.type === 'success') {
        return exchangeCodeAsync({ code: codeResult.params.code })
      }
      throw new Error('Error during login', { cause: JSON.stringify(codeResult) })
    })
  }
}

export const useRegister = () => {
  useBrowserWarmUp()
  const [, , promptAsync] = useCodeAuthRequest({ register: true }) ?? []
  return () => {
    if (isWeb) {
      window.location.href = REGISTRATION_ENDPOINT + `?redirect_uri=${REDIRECT_URI}&utm_source=app`
      return null
    }

    return promptAsync({ createTask: false }).then((codeResult) => {
      if (codeResult.type === 'success') {
        return exchangeCodeAsync({ code: codeResult.params.code })
      }

      throw new Error('Error during registration', { cause: JSON.stringify(codeResult) })
    })
  }
}

export default useLogin
