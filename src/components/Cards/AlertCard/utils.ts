import { genericErrorThrower } from '@/services/common/errors/generic-errors'
import { Href, router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'

export const createOnShow = (url: string | null) => () => {
  if (url) {
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