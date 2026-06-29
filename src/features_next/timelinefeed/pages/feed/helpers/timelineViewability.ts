import type { ViewToken } from 'react-native'

import type { RestTimelineFeedItem } from '@/services/timeline-feed/schema'

export const TIMELINE_VIEWABILITY_CONFIG = {
  viewAreaCoveragePercentThreshold: 50,
  minimumViewTime: 400,
} as const

type TimelineViewabilityPayload = {
  viewableItems: ViewToken<RestTimelineFeedItem>[]
  changed: ViewToken<RestTimelineFeedItem>[]
}

export const timelineViewabilityCallbackRef: {
  current: (payload: TimelineViewabilityPayload) => void
} = { current: () => undefined }

export const onTimelineViewableItemsChanged = ({ viewableItems, changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
  timelineViewabilityCallbackRef.current({
    viewableItems: viewableItems as ViewToken<RestTimelineFeedItem>[],
    changed: changed as ViewToken<RestTimelineFeedItem>[],
  })
}
