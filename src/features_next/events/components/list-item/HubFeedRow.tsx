import { memo } from 'react'
import { Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useMedia, YStack } from 'tamagui'

import { ActionCard } from '@/components/Cards'
import TrackImpressionWeb from '@/components/TrackImpressionWeb'

import { useNavigateToAction } from '@/features_next/actions/hooks/useNavigateToAction'
import type { HitSource } from '@/services/hits/constants'
import type { HubFeedRow as HubFeedRowType } from '@/services/hub/mapper'

import EventListItem from './EventListItem'

type HubFeedRowProps = {
  row: HubFeedRowType
  userUuid?: string
  source: HitSource
}

export const HubFeedRow = memo(({ row, userUuid, source }: HubFeedRowProps) => {
  const media = useMedia()
  const router = useRouter()
  const navigateToAction = useNavigateToAction()
  const paddingX = media.gtSm ? '$medium' : 0

  if (row.type === 'event') {
    const content = <EventListItem event={row.event} userUuid={userUuid} source={source} seed={row.seed} />
    if (Platform.OS === 'web') {
      return (
        <YStack px={paddingX}>
          <TrackImpressionWeb objectType="event" objectId={row.event.uuid} source={source}>
            {content}
          </TrackImpressionWeb>
        </YStack>
      )
    }
    return <YStack px={paddingX}>{content}</YStack>
  }

  const card = (
    <ActionCard
      payload={row.payload}
      isMyAction={row.editable}
      hitSource={source}
      onShow={() => {
        if (row.payload.id) {
          navigateToAction(row.payload.id, row.seed)
        }
      }}
      onEdit={() => {
        if (row.payload.id) {
          router.push(`/actions/${row.payload.id}/modifier`)
        }
      }}
    />
  )

  if (Platform.OS === 'web' && row.payload.id) {
    return (
      <YStack px={paddingX}>
        <TrackImpressionWeb objectType="action" objectId={row.payload.id} source={source}>
          {card}
        </TrackImpressionWeb>
      </YStack>
    )
  }

  return <YStack px={paddingX}>{card}</YStack>
})

HubFeedRow.displayName = 'HubFeedRow'
