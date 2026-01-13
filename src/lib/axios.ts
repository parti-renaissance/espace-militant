import { getUserAgent } from 'react-native-device-info'
import clientEnv from '@/config/clientEnv'
import { getRefreshToken } from '@/services/refresh-token/api'
import type { RestRefreshTokenResponse } from '@/services/refresh-token/schema'
import { useUserStore } from '@/store/user-store'
import { getFullVersion } from '@/utils/version'
import axios, { AxiosError, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import { identity } from 'fp-ts/lib/function'
import { isWeb } from 'tamagui'
import * as Sentry from '@sentry/react-native'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const baseConfig: CreateAxiosDefaults = {
  baseURL: clientEnv.API_BASE_URL,
  // withCredentials uniquement sur web (cookies de session)
  withCredentials: isWeb,
}

export const publicInstance = axios.create(baseConfig)
export const authInstance = axios.create(baseConfig)
// Instance pour le refresh, sans interceptors 401 pour éviter les boucles
export const refreshInstance = axios.create(baseConfig)

const TOKEN_EXPIRATION_LEEWAY = 30_000 // 30s de marge pour le clock skew
const REHYDRATE_COOLDOWN = 5_000 // 5s entre deux réhydratations
const REFRESH_BACKOFF_DELAYS = [1000, 2000, 5000] // Backoff progressif en ms

/**
 * Gestionnaire centralisé pour le refresh des tokens.
 */
class TokenRefreshManager {
  private refreshPromise: Promise<RestRefreshTokenResponse | undefined> | null = null
  private rehydratePromise: Promise<void> | null = null
  private lastRehydrateAt = 0
  private refreshFailureCount = 0
  private refreshDisabledUntil = 0

  private isTokenExpired(): boolean {
    const user = useUserStore.getState().user
    if (!user?.accessToken || !user.accessTokenExpiresAt) {
      return false
    }
    return user.accessTokenExpiresAt <= Date.now() + TOKEN_EXPIRATION_LEEWAY
  }

  private updateUserWithToken(response: RestRefreshTokenResponse): void {
    useUserStore.setState((state) => {
      const prevUser = state.user
      if (!prevUser) return state

      return {
        user: {
          ...prevUser,
          accessToken: response.access_token,
          refreshToken: response.refresh_token ?? prevUser.refreshToken,
          accessTokenExpiresIn: response.expires_in,
          accessTokenExpiresAt: Date.now() + response.expires_in * 1000,
        },
      }
    })
    this.refreshFailureCount = 0
    this.refreshDisabledUntil = 0
  }

  private async performTokenRefresh(
    refreshToken: string,
    context: string,
    applyBackoff: boolean = true
  ): Promise<RestRefreshTokenResponse | undefined> {
    try {
      const response = await getRefreshToken({ authInstance: refreshInstance, publicInstance: refreshInstance })({
        client_id: clientEnv.OAUTH_CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })

      if (!response) {
        return undefined
      }

      this.updateUserWithToken(response)
      return response
    } catch (refreshError) {
      const isInvalidToken = this.isInvalidTokenError(refreshError)

      if (isInvalidToken) {
        this.logError(refreshError, context)
        useUserStore.getState().removeCredentials()
        return undefined
      }

      // Backoff uniquement pour les refresh prédictifs, pas pour les 401
      if (applyBackoff) {
        this.refreshFailureCount++
        const backoffDelay =
          REFRESH_BACKOFF_DELAYS[Math.min(this.refreshFailureCount - 1, REFRESH_BACKOFF_DELAYS.length - 1)]
        this.refreshDisabledUntil = Date.now() + backoffDelay
      }

      // Log prédictif uniquement en dev ou après 3 échecs consécutifs
      const shouldLogPredictive =
        context === 'predictive refresh token failed' && (__DEV__ || this.refreshFailureCount >= 3)

      if (shouldLogPredictive) {
        if (__DEV__) {
          console.warn('[RefreshToken] Predictive refresh failed (network error)', refreshError)
        } else {
          this.logError(refreshError, context)
        }
      } else if (context !== 'predictive refresh token failed') {
        this.logError(refreshError, context)
      }

      return undefined
    }
  }

  // ✅ PATCH: détection OAuth2 plus stricte (invalid_grant)
  private isInvalidTokenError(error: unknown): boolean {
    // 1. Si c'est déjà une erreur transformée (GenericResponseError ou autre Error standard JS)
    // On analyse simplement le message
    if (error instanceof Error) {
      const msg = error.message.toLowerCase()
      // Détection des mots clés OAuth2 ou de l'erreur "The refresh token is invalid"
      if (msg.includes('invalid_grant') || (msg.includes('refresh token') && msg.includes('invalid')) || msg.includes('revoked')) {
        return true
      }
    }

    // 2. Si par hasard une AxiosError "survit" jusqu'ici (ex: erreur réseau brute non catchée par constructApi)
    // On considère toute 401 comme une session morte
    if (error instanceof AxiosError && error.response?.status === 401) {
      return true
    }

    return false
  }

  private async safeRehydrate(): Promise<void> {
    if (this.rehydratePromise) {
      return await this.rehydratePromise
    }

    this.rehydratePromise = useUserStore
      .getState()
      .rehydrateFromStorage()
      .finally(() => {
        this.rehydratePromise = null
      })

    return await this.rehydratePromise
  }

  /**
   * Réhydrate et vérifie si le token a été rafraîchi ailleurs.
   * Cooldown uniquement sur mobile. Sur web, réhydrate toujours pour détecter les refresh dans d'autres onglets.
   */
  private async rehydrateAndCheckToken(
    failedAccessToken?: string
  ): Promise<RestRefreshTokenResponse | undefined> {
    const now = Date.now()

    if (!isWeb && now - this.lastRehydrateAt < REHYDRATE_COOLDOWN) {
      return this.checkTokenFromMemory(failedAccessToken)
    }

    if (!isWeb) {
      const user = useUserStore.getState().user
      if (user?.accessTokenExpiresAt && user.accessTokenExpiresAt > Date.now() + TOKEN_EXPIRATION_LEEWAY) {
        return undefined
      }
    }

    try {
      await this.safeRehydrate()
      this.lastRehydrateAt = now
    } catch (err) {
      if (__DEV__) {
        console.warn('[RefreshToken] Rehydrate failed', err)
      }
    }

    return this.checkTokenFromMemory(failedAccessToken)
  }

  /**
   * Vérifie si le token en mémoire est valide.
   * Sur une 401, ne retourne le token que s'il est différent de celui qui a échoué.
   */
  private checkTokenFromMemory(failedAccessToken?: string): RestRefreshTokenResponse | undefined {
    const freshUser = useUserStore.getState().user
    const token = freshUser?.accessToken

    const isValidByTime =
      token && freshUser.accessTokenExpiresAt && freshUser.accessTokenExpiresAt > Date.now() + TOKEN_EXPIRATION_LEEWAY

    if (!isValidByTime) {
      return undefined
    }

    if (failedAccessToken && token === failedAccessToken) {
      return undefined
    }

    return {
      access_token: token,
      refresh_token: freshUser.refreshToken ?? '',
      expires_in: freshUser.accessTokenExpiresIn ?? 3600,
      token_type: 'Bearer',
    }
  }

  async refreshIfExpired(): Promise<void> {
    if (!this.isTokenExpired()) {
      return
    }

    if (Date.now() < this.refreshDisabledUntil) {
      return
    }

    if (this.refreshPromise) {
      await this.refreshPromise
      return
    }

    this.refreshPromise = this.executeRefresh('predictive refresh token failed').finally(() => {
      this.refreshPromise = null
    })

    await this.refreshPromise
  }

  /**
   * Lance un refresh en réponse à une 401.
   * Le refresh sur 401 est toujours tenté, même si le backoff est actif.
   */
  async refreshOn401(failedAccessToken?: string): Promise<RestRefreshTokenResponse | undefined> {
    const alreadyRefreshed = await this.rehydrateAndCheckToken(failedAccessToken)
    if (alreadyRefreshed) {
      return alreadyRefreshed
    }

    const freshUser = useUserStore.getState().user
    const freshRefreshToken = freshUser?.refreshToken

    if (!freshRefreshToken) {
      useUserStore.getState().removeCredentials()
      return undefined
    }

    if (this.refreshPromise) {
      return await this.refreshPromise
    }

    this.refreshPromise = this.executeRefresh('refresh token failed', false, failedAccessToken).finally(() => {
      this.refreshPromise = null
    })

    return await this.refreshPromise
  }

  private async executeRefresh(
    context: string,
    applyBackoff: boolean = true,
    failedAccessToken?: string
  ): Promise<RestRefreshTokenResponse | undefined> {
    try {
      const alreadyRefreshed = await this.rehydrateAndCheckToken(failedAccessToken)
      if (alreadyRefreshed) {
        return alreadyRefreshed
      }

      const freshUser = useUserStore.getState().user
      const refreshToken = freshUser?.refreshToken

      if (!refreshToken) {
        return undefined
      }

      return await this.performTokenRefresh(refreshToken, context, applyBackoff)
    } catch (err) {
      if (context === 'predictive refresh token failed' && __DEV__) {
        console.warn('[RefreshToken] Predictive refresh error', err)
      }
      return undefined
    }
  }

  logError(error: unknown, context: string): void {
    if (__DEV__) {
      console.warn(`[RefreshToken] ${context}`, error)
      return
    }

    const details: Record<string, unknown> = { context }
    if (error instanceof AxiosError) {
      details.status = error.response?.status

      // Sentry-safe : extraire seulement les champs OAuth2
      const data = error.response?.data
      if (data && typeof data === 'object') {
        const d = data as Record<string, unknown>
        details.oauth_error = typeof d.error === 'string' ? d.error : undefined
        details.oauth_error_description =
          typeof d.error_description === 'string' ? d.error_description : undefined
      } else if (typeof data === 'string') {
        details.oauth_error_description = data
      }

      details.url = error.config?.url
      details.method = error.config?.method
    }

    const user = useUserStore.getState().user
    if (user) {
      details.hasRefreshToken = !!user.refreshToken
      details.hasSessionId = !!user.sessionId
    }
    details.refreshFailureCount = this.refreshFailureCount

    // Titre clair (séparation par contexte)
    const message = `TokenRefresh: ${context}`

    if (error instanceof Error) {
      Sentry.captureException(error, {
        tags: { refresh_context: context, component: 'TokenRefresh' },
        extra: details,
      })
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        tags: { refresh_context: context, component: 'TokenRefresh' },
        extra: details,
      })
    }
  }
}

const tokenRefreshManager = new TokenRefreshManager()

const errorMonitor = (error: AxiosError) => {
  return Promise.reject(error)
}

let cachedUserAgent: string | null = null

const appVersionInterceptor = async (config: CustomAxiosRequestConfig) => {
  config.headers = config.headers ?? {}
  config.headers['X-App-version'] = getFullVersion()
  if (!isWeb) {
    // Cache le User-Agent pour éviter de le récupérer à chaque requête
    if (!cachedUserAgent) {
      try {
        cachedUserAgent = await getUserAgent()
      } catch {
        cachedUserAgent = null
      }
    }
    if (cachedUserAgent) {
      config.headers['User-Agent'] = cachedUserAgent
    }
  }

  return config
}

const authInterceptor = async (config: CustomAxiosRequestConfig) => {
  await tokenRefreshManager.refreshIfExpired()

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
refreshInstance.interceptors.request.use(appVersionInterceptor, errorMonitor)

authInstance.interceptors.response.use(
  identity,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true

    try {
      const authHeader = (originalRequest.headers?.Authorization ?? '') as string
      const failedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined

      const refreshResponse = await tokenRefreshManager.refreshOn401(failedToken)

      if (!refreshResponse) {
        const user = useUserStore.getState().user
        if (user?.accessToken) {
          const isTokenValid =
            user.accessTokenExpiresAt && user.accessTokenExpiresAt > Date.now() + TOKEN_EXPIRATION_LEEWAY

          if (isTokenValid) {
            return authInstance.request({
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${user.accessToken}`,
              },
            })
          }
        }
        return Promise.reject(error)
      }

      return authInstance.request({
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${refreshResponse.access_token}`,
        },
      } as CustomAxiosRequestConfig)
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 403) {
        tokenRefreshManager.logError(err, '403 during refresh')
      } else if (tokenRefreshManager['isInvalidTokenError'](err)) {
        tokenRefreshManager.logError(err, 'invalid refresh during refresh')
        useUserStore.getState().removeCredentials()
      } else {
        tokenRefreshManager.logError(err, 'unexpected error during refresh')
      }
      return Promise.reject(err)
    }
  }
)
