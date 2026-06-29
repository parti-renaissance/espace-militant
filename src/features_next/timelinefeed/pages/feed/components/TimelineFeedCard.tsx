import { memo } from 'react'
import { Platform } from 'react-native'
import { useRouter } from 'expo-router'

import { FeedCard } from '@/components/Cards'
import TrackImpressionWeb from '@/components/TrackImpressionWeb'
import { useNavigateToAction } from '@/features_next/actions/hooks/useNavigateToAction'
import { transformFeedItemToProps } from '../helpers/transformFeedItemToProps'

import { mapFeedItemToRestActionFull } from '@/services/common/mapper/mapTimelineFeedToRestAction'
import { mapFeedItemToRestEventSeed } from '@/services/common/mapper/mapTimelineFeedToRestEvent'
import { HIT_SOURCES } from '@/services/hits/constants'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'

const FeedCardMemoized = memo(FeedCard) as typeof FeedCard

export const TimelineFeedCard = memo((item: RestTimelineFeedItem) => {
  const router = useRouter()
  const navigateToAction = useNavigateToAction()
  const props = transformFeedItemToProps(item)

  if (!props) return null

  const cardProps =
    props.type === 'action'
      ? {
          ...props,
          onShow: () => navigateToAction(item.objectID, mapFeedItemToRestActionFull(item)),
          onEdit: () => router.push(`/actions/${item.objectID}/modifier`),
        }
      : props.type === 'event'
        ? {
            ...props,
            seed: mapFeedItemToRestEventSeed(item),
          }
        : props

  if (Platform.OS === 'web' && cardProps) {
    return (
      <TrackImpressionWeb objectType={item.type} objectId={item.objectID} source={HIT_SOURCES.PAGE_TIMELINE}>
        <FeedCardMemoized {...cardProps} hitSource={HIT_SOURCES.PAGE_TIMELINE} />
      </TrackImpressionWeb>
    )
  }

  return <FeedCardMemoized {...cardProps} hitSource={HIT_SOURCES.PAGE_TIMELINE} />
})

TimelineFeedCard.displayName = 'TimelineFeedCard'
