import { useGetMagicLink } from '@/services/magic-link/hook'
import * as types from '@/services/magic-link/schema'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'
import { useHits } from '@/services/hits/hook'

function useOpenExternalContent(props: { slug: types.Slugs; utm_source?: string; utm_campaign?: string }) {
  const queryLink = useGetMagicLink(props)
  const { trackClick } = useHits()

  return {
    ...queryLink,
    open: (params: types.RestGetMagicLinkRequest) => () => {
      let newWindow: WindowProxy | null = null
      if (isWeb) {
        newWindow = window.open('', '_blank')
      }

      queryLink.mutateAsync(params).then(({ url }) => {
        trackClick({
          target_url: url,
          button_name: props.slug,
          utm_source: props.utm_source,
          utm_campaign: props.utm_campaign,
        })
        if (isWeb) {
          if (newWindow) {
            newWindow.location.href = url
          } else {
            window.location.href = url
          }
        } else {
          WebBrowser.openBrowserAsync(url)
        }
      })
    },
  }
}

export { useOpenExternalContent }
