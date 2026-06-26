import { Href, router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'

import type { RestAlertsResponse } from '@/services/alerts/schema'
import { genericErrorThrower } from '@/services/common/errors/generic-errors'
import { type HitSource } from '@/services/hits/constants'
import { useHits } from '@/services/hits/hook'

type AlertItem = RestAlertsResponse[number]

const getPronosticRoute = (alert?: AlertItem) => {
  if (alert?.type?.toLowerCase() !== 'pronostic') return undefined

  return alert.data?.participation ? '/prono/jouer' : '/prono'
}

export const createOnShow = (url: string | null, buttonLabel: string | null | undefined, hitSource: HitSource, alert?: AlertItem) => {
  const { trackClick } = useHits()

  return () => {
    const targetUrl = getPronosticRoute(alert) ?? url

    if (targetUrl) {
      try {
        trackClick({
          object_type: 'alert',
          source: hitSource,
          target_url: targetUrl || undefined,
          button_name: buttonLabel || undefined,
        })
      } catch (error) {
        // Silently ignore tracking errors - they should not impact user experience
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn('[AlertCard] trackClick error:', error)
        }
      }

      try {
        if (targetUrl.startsWith('/')) {
          router.push(targetUrl as Href)
        } else if (isWeb) {
          window.open(targetUrl, '_blank')
        } else {
          WebBrowser.openBrowserAsync(targetUrl)
        }
      } catch (error) {
        genericErrorThrower(error)
      }
    }
  }
}
