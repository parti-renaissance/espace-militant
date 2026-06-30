import { useEffect, useMemo } from 'react'
import { Platform } from 'react-native'
import * as Linking from 'expo-linking'
import { useGlobalSearchParams, usePathname } from 'expo-router'

import clientEnv from '@/config/clientEnv'
import { AsyncStorage } from '@/hooks/useStorageState'
import * as api from '@/services/matomo/api'
import {
  buildMatomoUrl,
  extractUtmFromSearchParams,
  hasUtmParams,
  utmToMatomoParams,
} from '@/services/matomo/helpers'

const FIRST_OPEN_KEY = 'trackings.first_open'
const TRACKINGS_LOG_PREFIX = '[trackings]'
const shouldLogTrackings = clientEnv.ENVIRONMENT === 'staging'

function logScreenViewPayload(data: Parameters<typeof api.trackScreenView>[0]) {
  // eslint-disable-next-line no-console
  console.log(TRACKINGS_LOG_PREFIX, 'screenView', {
    pathname: data.pathname,
    utm: data.utm,
    url: buildMatomoUrl(data.pathname, data.utm),
    campaignParams: utmToMatomoParams(data.utm),
  })
}

function logFirstOpenPayload(data?: Parameters<typeof api.trackFirstOpen>[0]) {
  // eslint-disable-next-line no-console
  console.log(TRACKINGS_LOG_PREFIX, 'firstOpen', {
    utm: data?.utm,
    campaignParams: utmToMatomoParams(data?.utm),
  })
}

function logEventPayload(data: Parameters<typeof api.trackEvent>[0]) {
  // eslint-disable-next-line no-console
  console.log(TRACKINGS_LOG_PREFIX, 'event', data)
}

function logActionPayload(data: Parameters<typeof api.trackAction>[0]) {
  // eslint-disable-next-line no-console
  console.log(TRACKINGS_LOG_PREFIX, 'action', data)
}

function logAppStartPayload(data?: Parameters<typeof api.trackAppStart>[0]) {
  // eslint-disable-next-line no-console
  console.log(TRACKINGS_LOG_PREFIX, 'appStart', data)
}

function trackEvent(data: Parameters<typeof api.trackEvent>[0]) {
  if (shouldLogTrackings) logEventPayload(data)
  return api.trackEvent(data)
}

function trackAction(data: Parameters<typeof api.trackAction>[0]) {
  if (shouldLogTrackings) logActionPayload(data)
  return api.trackAction(data)
}

function trackScreenView(data: Parameters<typeof api.trackScreenView>[0]) {
  if (shouldLogTrackings) logScreenViewPayload(data)
  return api.trackScreenView(data)
}

function trackAppStart(data?: Parameters<typeof api.trackAppStart>[0]) {
  if (shouldLogTrackings) logAppStartPayload(data)
  return api.trackAppStart(data)
}

function trackFirstOpen(data?: Parameters<typeof api.trackFirstOpen>[0]) {
  if (shouldLogTrackings) logFirstOpenPayload(data)
  return api.trackFirstOpen(data)
}

async function getBootUtmParams(searchParams: Record<string, string | string[] | undefined>) {
  const fromRoute = extractUtmFromSearchParams(searchParams)
  if (hasUtmParams(fromRoute) || Platform.OS === 'web') {
    return fromRoute
  }

  const initialUrl = await Linking.getInitialURL()
  if (!initialUrl) return fromRoute

  const parsed = Linking.parse(initialUrl)
  const fromInitialUrl = extractUtmFromSearchParams(parsed.queryParams ?? {})
  return hasUtmParams(fromInitialUrl) ? fromInitialUrl : fromRoute
}

export const useInitMatomo = () => {
  const pathname = usePathname()
  const searchParams = useGlobalSearchParams()
  const utm = useMemo(() => extractUtmFromSearchParams(searchParams), [searchParams])

  useEffect(() => {
    let cancelled = false

    async function trackBoot() {
      const bootUtm = await getBootUtmParams(searchParams)
      if (cancelled) return

      if (Platform.OS !== 'web') {
        const alreadySent = await AsyncStorage.getItem(FIRST_OPEN_KEY)
        if (!alreadySent) {
          try {
            await trackFirstOpen({ utm: bootUtm })
            await AsyncStorage.setItem(FIRST_OPEN_KEY, '1')
          } catch (error) {
            if (__DEV__) {
              // eslint-disable-next-line no-console
              console.warn(TRACKINGS_LOG_PREFIX, 'firstOpen failed, flag not persisted', error)
            }
          }
        }
      }

      if (cancelled) return
      trackAppStart({ utm: bootUtm })
    }

    void trackBoot()

    return () => {
      cancelled = true
    }
    // Boot tracking (first_open + app start) runs once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    trackScreenView({ pathname, utm })
  }, [pathname, utm])
}
