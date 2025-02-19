import { Platform } from 'react-native'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import useShareApi from '@/hooks/useShareApi'

type ShareHandler = (x: { url: string; message: string }) => void

export const useShareOrCopy = () => {
  const _handleCopyUrl = useHandleCopyUrl()

  const handleCopyUrl: ShareHandler = ({ url }) => _handleCopyUrl(url)

  const { shareAsync, isShareAvailable } = useShareApi()

  const handleShareUrl: ShareHandler = ({ url, message }) => {
    if (!isShareAvailable) {
      return
    }
    shareAsync(
      Platform.select({
        android: { message, url },
        ios: { message, url },
        default: { title: message, url },
      }),
    ).catch(() => {})
  }
  return {
    handleShareOrCopy: isShareAvailable ? handleShareUrl : handleCopyUrl,
    type: isShareAvailable ? 'share' : 'copy',
  }
}
