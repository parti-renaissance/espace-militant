import { useMemo, type ReactNode } from 'react'
import { Platform } from 'react-native'
import { YStack } from 'tamagui'

import AutoSizeImage from '@/components/AutoSizeImage'
import FeedVideoPlayer from '@/features_next/video/components/FeedVideoPlayer'
import { getVideoAspectRatio } from '@/features_next/video/components/VideoPlayer.types'
import VideoMediaCarousel from '@/features_next/video/components/VideoMediaCarousel'
import { useVideoFeedAppState } from '@/features_next/video/hooks/useVideoFeedAppState'
import { buildVideoId, useIsContentInFeedView, useIsFocusedContent } from '@/features_next/video/store/videoFeedStore'
import { RestTimelineFeedSocialMedia, RestTimelineFeedSocialMediaItem } from '@/services/timeline-feed/schema'

type FeedImage = {
  url: string | null
  width: number | null
  height: number | null
} | null

const MIN_MEDIA_HEIGHT = 200

const getMediaAspectRatio = (item: RestTimelineFeedSocialMediaItem) => {
  if (item.type === 'video') {
    return getVideoAspectRatio(item.width ?? undefined, item.height ?? undefined)
  }
  return item.height > 0 ? item.width / item.height : 1
}

const SocialPostMediaFrame = ({ children }: { children: ReactNode }) => (
  <YStack
    width="100%"
    minHeight={MIN_MEDIA_HEIGHT}
    backgroundColor="$gray2"
    overflow="hidden"
    justifyContent="center"
    alignItems="center"
    {...(Platform.OS === 'web' ? { userSelect: 'none' } : {})}
  >
    {children}
  </YStack>
)

type SocialPostMediaItemProps = {
  contentId: string
  item: RestTimelineFeedSocialMediaItem
  slideIndex: number
  isSlideViewable: boolean
}

const SocialPostMediaItem = ({ contentId, item, slideIndex, isSlideViewable }: SocialPostMediaItemProps) => {
  if (item.type === 'video') {
    return (
      <SocialPostMediaFrame>
        <YStack width="100%" minHeight={MIN_MEDIA_HEIGHT} style={{ aspectRatio: getMediaAspectRatio(item) }}>
          <FeedVideoPlayer
            contentId={contentId}
            videoId={buildVideoId(contentId, slideIndex)}
            hlsUrl={item.hls_url}
            thumbnailUrl={item.thumbnail_url}
            width={item.width ?? undefined}
            height={item.height ?? undefined}
            isSlideViewable={isSlideViewable}
          />
        </YStack>
      </SocialPostMediaFrame>
    )
  }

  const aspectRatio = getMediaAspectRatio(item)

  return (
    <SocialPostMediaFrame>
      <YStack width="100%" minHeight={MIN_MEDIA_HEIGHT} style={{ aspectRatio }}>
        <AutoSizeImage source={item.url} width={item.width} height={item.height} />
      </YStack>
    </SocialPostMediaFrame>
  )
}

type SocialPostMediaProps = {
  contentId: string
  media?: RestTimelineFeedSocialMedia | null
  image?: FeedImage
}

const SocialPostMedia = ({ contentId, media, image }: SocialPostMediaProps) => {
  useVideoFeedAppState()

  const isWeb = Platform.OS === 'web'
  const isPostInView = useIsContentInFeedView(contentId)
  const isFocusedPost = useIsFocusedContent(contentId)

  const items = useMemo(() => {
    if (media?.items?.length) return media.items
    if (image?.url) {
      return [
        {
          type: 'photo' as const,
          url: image.url,
          width: image.width ?? 1,
          height: image.height ?? 1,
        },
      ]
    }
    return []
  }, [media, image])

  if (items.length === 0) return null

  if (items.length > 1) {
    return <VideoMediaCarousel contentId={contentId} items={items} isWeb={isWeb} />
  }

  return (
    <SocialPostMediaItem
      contentId={contentId}
      item={items[0]}
      slideIndex={0}
      isSlideViewable={items[0].type === 'video' ? isPostInView && isFocusedPost : false}
    />
  )
}

export default SocialPostMedia
