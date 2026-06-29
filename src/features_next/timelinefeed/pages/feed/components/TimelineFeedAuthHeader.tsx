import { useMemo } from 'react'
import { Link } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import { Sparkle } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import Title from '@/components/Title/Title'
import { AlertItemBanner } from './AlertItemBanner'
import { LiveAlerts } from './LiveAlerts'
import NotificationSubscribeCard from './NotificationSubscribeCard'

import type { RestAlertsResponse } from '@/services/alerts/schema'
import { filterBannerAlerts, filterLiveAlerts } from '@/services/alerts/utils'

type TimelineFeedAuthHeaderProps = {
  alerts: RestAlertsResponse
  shouldShowNotificationCard: boolean
  hasPublications: boolean
}

export function TimelineFeedAuthHeader({ alerts, shouldShowNotificationCard, hasPublications }: TimelineFeedAuthHeaderProps) {
  const media = useMedia()

  const liveAlerts = useMemo(() => filterLiveAlerts(alerts), [alerts])
  const bannerAlerts = useMemo(() => filterBannerAlerts(alerts), [alerts])
  const hasLiveAlerts = liveAlerts.length > 0
  const hasAlerts = bannerAlerts.length > 0
  const hasContentAboveTitle = shouldShowNotificationCard || hasLiveAlerts || hasAlerts

  return (
    <YStack gap={media.sm ? 8 : 16}>
      {hasContentAboveTitle ? (
        <YStack gap={16} mt={16}>
          {shouldShowNotificationCard ? <NotificationSubscribeCard /> : null}
          {hasLiveAlerts ? <LiveAlerts alerts={liveAlerts} /> : null}
          {hasAlerts ? <AlertItemBanner alerts={bannerAlerts} /> : null}
        </YStack>
      ) : null}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        px={media.sm ? '$medium' : '$0'}
        pt={hasContentAboveTitle ? undefined : '$large'}
        flexWrap="wrap"
        gap="$medium"
      >
        <Title size="h1" aria-label="Des (bonnes) Nouvelles">
          <Title.Text>Des (bonnes)</Title.Text>
          <Title.Highlight>Nouvelles</Title.Highlight>
        </Title>
        {hasPublications ? (
          <Link href="/publications" asChild>
            <VoxButton variant="soft" size="sm" theme="pink" iconLeft={Sparkle}>
              Nouvelle publication
            </VoxButton>
          </Link>
        ) : null}
      </XStack>
    </YStack>
  )
}
