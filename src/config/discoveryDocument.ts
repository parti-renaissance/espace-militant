import { Platform } from 'react-native'
import { getUserAgent } from 'react-native-device-info'
import clientEnv from '@/config/clientEnv'
import { getFullVersion } from '@/utils/version'
import type { DiscoveryDocument } from 'expo-auth-session'
import qs from 'qs'

export const AUTHORIZATION_ENDPOINT = `${clientEnv.OAUTH_BASE_URL}/oauth/v2/auth`
export const REGISTRATION_ENDPOINT = `${clientEnv.OAUTH_BASE_URL}/adhesion`
export const END_SESSION_ENDPOINT = `${clientEnv.OAUTH_BASE_URL}/deconnexion`

export const getDiscoveryDocument = async (): Promise<DiscoveryDocument> => {
  const deviceInfo = {
    'user-agent': await getUserAgent(),
    'app-version': getFullVersion(),
    system: Platform.OS,
  }

  return {
    tokenEndpoint: `${clientEnv.OAUTH_BASE_URL}/oauth/v2/token?${qs.stringify(deviceInfo)}`,
    authorizationEndpoint: AUTHORIZATION_ENDPOINT,
    registrationEndpoint: REGISTRATION_ENDPOINT,
    endSessionEndpoint: END_SESSION_ENDPOINT,
  }
}
