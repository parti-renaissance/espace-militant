import { genericErrorThrower } from '@/services/common/errors/generic-errors'
import { Href, router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'
import { useHits } from '@/services/hits/hook'

export const createOnShow = (url: string | null, buttonLabel: string | null) => {
  const { trackClick } = useHits()
  
  return () => {
    if (url) {
      trackClick({
        object_type: 'alert',
        target_url: url || undefined,
        button_name: buttonLabel || undefined,
      })
      
      try {
        if (url.startsWith('/')) {
          router.push(url as Href)
        } else if (isWeb) {
          window.open(url, '_blank')
        } else {
          WebBrowser.openBrowserAsync(url)
        }
      } catch (error) {
        genericErrorThrower(error)
      }
    }
  }
} 