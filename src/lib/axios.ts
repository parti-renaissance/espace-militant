import clientEnv from '@/config/clientEnv'
import { getRefreshToken } from '@/services/refresh-token/api'
import { useUserStore } from '@/store/user-store'
import { getFullVersion } from '@/utils/version'
import axios, { AxiosError, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import { identity } from 'fp-ts/lib/function'

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

const appVersionInterceptor = (config: CustomAxiosRequestConfig) => {
  config.headers['X-App-version'] = getFullVersion()

  return config
}

const authInterceptor = (config: CustomAxiosRequestConfig) => {
  const accessToken = useUserStore.getState().user?.accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

publicInstance.interceptors.request.use(appVersionInterceptor, errorMonitor)
authInstance.interceptors.request.use(appVersionInterceptor, errorMonitor)
authInstance.interceptors.request.use(authInterceptor, errorMonitor)

let refreshing_token: Promise<Awaited<ReturnType<ReturnType<typeof getRefreshToken>>> | undefined> | null = null

authInstance.interceptors.response.use(identity, async function (error: AxiosError) {
  const originalRequest: CustomAxiosRequestConfig | undefined = error.config

  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true
    try {
      const refreshToken = useUserStore.getState().user?.refreshToken
      if (!refreshToken) {
        useUserStore.getState().removeCredentials()
        return
      }

      refreshing_token =
        refreshing_token ??
        getRefreshToken({ authInstance, publicInstance })({
          client_id: clientEnv.OAUTH_CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).catch(() => {
          useUserStore.getState().removeCredentials()
          return undefined
        })
      const response = await refreshing_token
      refreshing_token = null

      if (response) {
        useUserStore.setState({ user: { accessToken: response.access_token, refreshToken: response.refresh_token } })

        originalRequest.headers.Authorization = `Bearer ${response.access_token}`
      }

      return authInstance(originalRequest)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        useUserStore.getState().removeCredentials()
        return
      }
    }
  }

  return Promise.reject(error)
})
