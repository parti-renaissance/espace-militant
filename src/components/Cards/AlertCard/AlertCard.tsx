import React from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { MeetingAlertCollapsed } from '@/components/Cards/AlertCard/components'
import VoxCard, { VoxCardFrameProps } from '@/components/VoxCard/VoxCard'
import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { createOnShow } from '@/components/Cards/AlertCard/utils'
import { BellElectric, ExternalLink, Radio } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'

export type AlertVoxCardProps = {
  payload: RestAlertsResponse[0]
} & VoxCardFrameProps

const AlertMeetingCard = (props: AlertVoxCardProps) => {
  const { handleShareOrCopy } = useShareOrCopy()

  const onPressShare = () => {
    if (!props.payload.share_url) return
    return handleShareOrCopy({ url: props.payload.share_url, message: props.payload.title })
  }

  return (
    <MeetingAlertCollapsed
      onShow={createOnShow(props.payload.cta_url)}
      onPressShare={onPressShare}
      payload={props.payload}
    />
  )
}

const AlertOnLiveCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const onShow = createOnShow(payload.cta_url)
  return (
    <VoxCard
      {...props}
      backgroundColor="$orange1"
      borderRadius="$medium"
    >
      <VoxCard.Content gap="$small">
        <XStack justifyContent="space-between">
          <VoxCard.Chip alert icon={Radio}>
            {payload.label}
          </VoxCard.Chip>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack flexShrink={1}>
            <Text.LG multiline>{payload.title}</Text.LG>
          </XStack>

          {payload.cta_label && payload.cta_url && (
            <XStack justifyContent="flex-end">
              <VoxButton variant="soft" backgroundColor="white" theme="orange" textColor="#FF3333" onPress={onShow}>
                {payload.cta_label}
              </VoxButton>
            </XStack>
          )}
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const AlertAnnonceLiveCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const onShow = createOnShow(payload.cta_url)
  return (
    <VoxCard
    {...props}
    backgroundColor="$textOutline20"
    borderRadius="$medium"
    >
      <VoxCard.Content gap="$small">
        <XStack justifyContent="space-between">
          <VoxCard.Chip alert icon={Radio}>
            {payload.label}
          </VoxCard.Chip>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack flexShrink={1}>
            <Text.LG multiline>{payload.title}</Text.LG>
          </XStack>
          {payload.cta_label && payload.cta_url && (
            <XStack justifyContent="flex-end">
              <VoxButton variant="soft" backgroundColor="white" theme="orange" textColor="#FF3333" onPress={onShow}>
                {payload.cta_label}
              </VoxButton>
            </XStack>
          )}
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const AlertBasicCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const onShow = createOnShow(payload.cta_url)
  return (
    <VoxCard
      {...props}
      borderRadius="$medium"
    >
      <VoxCard.Content>
        <XStack justifyContent="space-between">
          <VoxCard.Chip theme="orange" icon={BellElectric}>
            {payload.label}
          </VoxCard.Chip>
        </XStack>
        <VoxCard.Title>{payload.title}</VoxCard.Title>
        <VoxCard.Description markdown>{payload.description}</VoxCard.Description>
        {payload.cta_label && payload.cta_url && (
          <XStack justifyContent="flex-end">
            <VoxButton variant="outlined" minWidth={80} iconLeft={ExternalLink} onPress={onShow}>
              {payload.cta_label}
            </VoxButton>
          </XStack>
        )}
      </VoxCard.Content>
    </VoxCard>
  )
}

const AlertCard = (props: AlertVoxCardProps) => {
  const {
    payload: { type },
  } = props
  if (!type) return <AlertBasicCard {...props} />
  if (type === 'live') return <AlertOnLiveCard {...props} />
  if (type === 'live_announce') return <AlertAnnonceLiveCard {...props} />
  if (type === 'meeting') return <AlertMeetingCard {...props} />
  return <AlertBasicCard {...props} />
}

export default AlertCard
