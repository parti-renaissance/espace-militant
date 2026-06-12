import { memo } from 'react'
import { useMedia, XStack, YStack } from 'tamagui'
import { Radio } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { createOnShow } from '@/components/Cards/AlertCard/utils'

import type { RestAlertsResponse } from '@/services/alerts/schema'
import { HIT_SOURCES, type HitSource } from '@/services/hits/constants'

type LiveAlertItem = RestAlertsResponse[number]

const LIVE_BADGE_COLOR = '#FF3333'

type LiveAlertRowProps = {
  alert: LiveAlertItem
  hitSource: HitSource
}

const LiveAlertRow = memo(({ alert, hitSource }: LiveAlertRowProps) => {
  const onShow = createOnShow(alert.cta_url, alert.cta_label, hitSource)
  const isLive = alert.type === 'live'
  const isPressable = Boolean(alert.cta_url)

  return (
    <XStack
      alignItems="center"
      gap={12}
      padding={12}
      borderRadius={999}
      backgroundColor={isLive ? '$red100' : '$gray200'}
      cursor={isPressable ? 'pointer' : undefined}
      onPress={isPressable ? onShow : undefined}
      hoverStyle={isPressable ? { backgroundColor: isLive ? '$red200' : '$gray300' } : undefined}
      pressStyle={isPressable ? { opacity: 0.85 } : undefined}
    >
      <XStack alignItems="center" gap={6} backgroundColor={LIVE_BADGE_COLOR} borderRadius={999} paddingVertical={5} paddingHorizontal={10} flexShrink={0}>
        <Radio size={12} color="white" />
        <Text.SM semibold color="white">
          {alert.label}
        </Text.SM>
      </XStack>
      <Text.SM semibold flex={1} minWidth={0} numberOfLines={1}>
        {alert.title}
      </Text.SM>
      {alert.cta_label && alert.cta_url ? (
        <VoxButton flexShrink={0} variant="soft" size="xs" backgroundColor="white" theme="red" textColor={LIVE_BADGE_COLOR} pointerEvents="none">
          {alert.cta_label}
        </VoxButton>
      ) : null}
    </XStack>
  )
})

LiveAlertRow.displayName = 'LiveAlertRow'

type LiveAlertsProps = {
  alerts: RestAlertsResponse
  hitSource?: HitSource
}

export function LiveAlerts({ alerts, hitSource = HIT_SOURCES.PAGE_TIMELINE }: LiveAlertsProps) {
  const media = useMedia()

  if (alerts.length === 0) return null

  return (
    <YStack gap={8} px={media.gtSm ? 0 : '$medium'}>
      {alerts.map((alert, index) => (
        <LiveAlertRow key={`${alert.title}-${index}`} alert={alert} hitSource={hitSource} />
      ))}
    </YStack>
  )
}
