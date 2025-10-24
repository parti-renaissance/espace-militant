import React from 'react'
import { YStack, XStack, Separator } from 'tamagui'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestEventStatsResponse } from '@/services/stats/schema'

interface EventStatsCardProps {
  stats: RestEventStatsResponse
}

const PerformanceRow: React.FC<{
  category: string
  total: { count: number | string }
  subcategories: Array<{ label: string; percentage: string; count: number | string }>
}> = ({ category, total, subcategories }) => (
  <YStack gap={12}>
    <XStack justifyContent="space-between" alignItems="center">
      <Text.MD medium>{category}</Text.MD>
      <XStack gap="$small" alignItems="center">
        <Text.MD semibold>{total.count}</Text.MD>
      </XStack>
    </XStack>
    {subcategories.map((sub, index) => (
      <XStack key={index} justifyContent="space-between" alignItems="center">
        <Text.SM>{sub.label}</Text.SM>
        <XStack gap="$small" alignItems="center">
          <Text.SM secondary>{sub.percentage}</Text.SM>
          <Text.SM>{sub.count}</Text.SM>
        </XStack>
      </XStack>
    ))}
  </YStack>
)

const EventStatsCard: React.FC<EventStatsCardProps> = ({ stats }) => {
  return (
    <VoxCard inside borderColor="$textOutline" borderWidth={1}>
      <VoxCard.Content>
        <YStack gap="$medium">
          <YStack gap={12}>
            <PerformanceRow
              category="Impressions uniques"
              total={{
                count: stats.unique_impressions.total,
              }}
              subcategories={[
                {
                  label: 'Depuis le fil',
                  percentage: '',
                  count: stats.unique_impressions.timeline,
                },
                {
                  label: 'Depuis la liste',
                  percentage: '',
                  count: stats.unique_impressions.list,
                },
              ]}
            />

            <Separator borderColor="$textOutline" />

            <PerformanceRow
              category="Ouvertures uniques"
              total={{
                count: stats.unique_opens.total,
              }}
              subcategories={[
                {
                  label: 'Depuis le fil',
                  percentage: '',
                  count: stats.unique_opens.timeline,
                },
                {
                  label: 'Depuis la liste',
                  percentage: '',
                  count: stats.unique_opens.list,
                },
                {
                  label: 'Depuis la notification',
                  percentage: '',
                  count: stats.unique_opens.notification,
                },
                {
                  label: 'Depuis un lien direct',
                  percentage: '',
                  count: stats.unique_opens.direct_link,
                },
              ]}
            />
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default EventStatsCard

