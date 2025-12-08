import { getUserAgent } from 'react-native-device-info'
import clientEnv from '@/config/clientEnv'
import { getRefreshToken } from '@/services/refresh-token/api'
import { useUserStore } from '@/store/user-store'
import { getFullVersion } from '@/utils/version'
import axios, { AxiosError, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import { identity } from 'fp-ts/lib/function'
import { isWeb } from 'tamagui'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const baseConfig: CreateAxiosDefaults = {
  baseURL: clientEnv.API_BASE_URL,
  withCredentials: true,
}

export const publicInstance = axios.create(baseConfig)
export const authInstance = axios.create(baseConfig)

const errorMonitor = (error: AxiosError) => {
  return Promise.reject(error)
}

const appVersionInterceptor = async (config: CustomAxiosRequestConfig) => {
  config.headers = config.headers ?? {}
  config.headers['X-App-version'] = getFullVersion()
  if (!isWeb) {
    config.headers['User-Agent'] = await getUserAgent()
  }

  return config
}

const authInterceptor = (config: CustomAxiosRequestConfig) => {
  const accessToken = useUserStore.getState().user?.accessToken

  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

publicInstance.interceptors.request.use(appVersionInterceptor, errorMonitor)
authInstance.interceptors.request.use(appVersionInterceptor, errorMonitor)
authInstance.interceptors.request.use(authInterceptor, errorMonitor)

// Une seule promesse de refresh par runtime (onglet / app)
let refreshing_token: Promise<Awaited<ReturnType<ReturnType<typeof getRefreshToken>>> | undefined> | null = null

authInstance.interceptors.response.use(
  identity,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined

    // Si ce n'est pas une 401 ou qu'on n'a pas la requête d'origine → on laisse passer
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    // On évite la boucle infinie : une seule tentative de refresh par requête
    if (originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true

    const user = useUserStore.getState().user
    const refreshToken = user?.refreshToken

    // Pas de refresh_token → session réellement expirée
    if (!refreshToken) {
      useUserStore.getState().removeCredentials()
      return Promise.reject(error)
    }

    try {
      // Si aucun refresh en cours dans CE runtime, on en lance un
      if (!refreshing_token) {
        refreshing_token = getRefreshToken({ authInstance, publicInstance })({
          client_id: clientEnv.OAUTH_CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        })
          .then((response) => {
            if (!response) return undefined

            // On met à jour le user en conservant les autres champs
            useUserStore.setState((state) => {
              const prevUser = state.user
              if (!prevUser) return state

              return {
                user: {
                  ...prevUser,
                  accessToken: response.access_token,
                  // si l'API ne renvoie pas de nouveau refresh_token, on garde l'ancien
                  refreshToken: response.refresh_token ?? prevUser.refreshToken,
                },
              }
            })

            return response
          })
          .catch((refreshError) => {
            // Échec du refresh → session expirée
            console.warn('refresh token failed', refreshError)
            useUserStore.getState().removeCredentials()
            return undefined
          })
          .finally(() => {
            refreshing_token = null
          })
      }

      // On attend le refresh, que ce soit celui qu'on vient de lancer
      // ou un déjà en cours
      const refreshResponse = await refreshing_token

      // Si pas de réponse → on considère la session expirée
      if (!refreshResponse) {
        return Promise.reject(error)
      }

      // On rejoue la requête originale avec le nouvel access token
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${refreshResponse.access_token}`

      return authInstance(originalRequest)
    } catch (err) {
      // Cas spécifique : 403 pendant le refresh
      if (err instanceof AxiosError && err.response?.status === 403) {
        useUserStore.getState().removeCredentials()
      }

      return Promise.reject(err)
    }
  }
)
