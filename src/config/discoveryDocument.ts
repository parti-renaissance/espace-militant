import { getUserAgent } from 'react-native-device-info'
import clientEnv from '@/config/clientEnv'
import { getFullVersion } from '@/utils/version'
import type { DiscoveryDocument } from 'expo-auth-session'

export const AUTHORIZATION_ENDPOINT = `${clientEnv.OAUTH_BASE_URL}/oauth/v2/auth`
export const REGISTRATION_ENDPOINT = `${clientEnv.OAUTH_BASE_URL}/adhesion`
export const END_SESSION_ENDPOINT = `${clientEnv.OAUTH_BASE_URL}/deconnexion`

export const getDiscoveryDocument = async (): Promise<DiscoveryDocument> => {
  const userAgent = await getUserAgent()

  return {
    tokenEndpoint: `${clientEnv.OAUTH_BASE_URL}/oauth/v2/token?app-version=${encodeURIComponent(getFullVersion())}&user-agent=${encodeURIComponent(userAgent)}`,
    authorizationEndpoint: AUTHORIZATION_ENDPOINT,
    registrationEndpoint: REGISTRATION_ENDPOINT,
    endSessionEndpoint: END_SESSION_ENDPOINT,
  }
}
