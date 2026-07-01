import { ViewToken } from 'react-native'

import { buildVideoId, useVideoFeedStore } from '@/features/video/store/videoFeedStore'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'

const getFirstVideoSlideIndex = (item: RestTimelineFeedItem) =>
  item.media?.items?.findIndex((mediaItem) => mediaItem.type === 'video') ?? -1

type SyncTimelinePostVideoVisibilityParams = {
  viewableItems: ViewToken<RestTimelineFeedItem>[]
  changed: ViewToken<RestTimelineFeedItem>[]
}

const applyTimelineVideoFocus = (viewableItems: ViewToken<RestTimelineFeedItem>[]) => {
  const store = useVideoFeedStore.getState()

  const viewablePostsWithVideo = viewableItems.filter(
    (token) => token.isViewable && token.item?.type === 'social_network_post' && getFirstVideoSlideIndex(token.item) >= 0,
  )

  if (viewablePostsWithVideo.length === 0) {
    store.clearVideoFeedFocus()
    return
  }

  viewablePostsWithVideo.forEach((token) => {
    store.setContentVisibilityRatio(token.item!.objectID, token.percentVisible ?? 0)
  })

  const bestPost = viewablePostsWithVideo.reduce((current, candidate) => {
    const currentPercent = current.percentVisible ?? 0
    const candidatePercent = candidate.percentVisible ?? 0
    return candidatePercent > currentPercent ? candidate : current
  })

  const contentId = bestPost.item!.objectID
  const ratio = bestPost.percentVisible ?? 1
  const slideIndex = getFirstVideoSlideIndex(bestPost.item!)
  const defaultVideoId = buildVideoId(contentId, slideIndex)

  store.setContentVisibilityRatio(contentId, ratio)
  store.setFocusedContentId(contentId)

  if (!store.viewableVideoIdByContentId[contentId]) {
    store.setViewableVideoForContent(contentId, defaultVideoId)
  }

  store.recomputeActiveVideoId()
}

/** Un seul post vidéo actif : celui le plus visible dans le feed vertical. */
export const syncTimelinePostVideoVisibility = ({ viewableItems, changed }: SyncTimelinePostVideoVisibilityParams) => {
  const store = useVideoFeedStore.getState()

  changed.forEach((token) => {
    if (token.item?.type !== 'social_network_post') return

    store.setContentViewable(token.item.objectID, token.isViewable)

    if (token.isViewable) {
      store.setContentVisibilityRatio(token.item.objectID, token.percentVisible ?? 1)
    } else {
      store.setContentVisibilityRatio(token.item.objectID, 0)
    }
  })

  applyTimelineVideoFocus(viewableItems)
}
