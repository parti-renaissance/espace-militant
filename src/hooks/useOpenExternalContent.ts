import { useGetMagicLink } from '@/services/magic-link/hook'
import * as types from '@/services/magic-link/schema'
import * as WebBrowser from 'expo-web-browser'
import { isWeb } from 'tamagui'

function useOpenExternalContent(props: { slug: types.Slugs }) {
  const queryLink = useGetMagicLink(props)

  return {
    ...queryLink,
    open: (params: types.RestGetMagicLinkRequest) => () => {
      queryLink.mutateAsync(params).then(({ url }) => {
        if (isWeb) {
          window.open(url, '_blank')
        } else {
          WebBrowser.openBrowserAsync(url)
        }
      })
    },
  }
}

export { useOpenExternalContent }
