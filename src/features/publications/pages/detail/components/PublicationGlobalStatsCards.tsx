import React from 'react'
import { YStack, XStack, Separator } from 'tamagui'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestPublicationStatsResponse } from '@/services/stats/schema'
import { DateFormatter } from '@/utils/DateFormatter'
import { NumberFormatter } from '@/utils/NumberFormatter'

interface PublicationGlobalStatsCardsProps {
  stats: RestPublicationStatsResponse
}

const StatCard: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <YStack
    backgroundColor="$gray1"
    borderRadius="$4"
    padding="$medium"
    alignItems="center"
    justifyContent="center"
    flex={1}
    minHeight={80}
  >
    <Text fontSize={24} fontWeight="600" color="$purple5">
      {value}
    </Text>
    <Text.SM color="$gray10" textAlign="center" fontWeight="500">
      {label}
    </Text.SM>
  </YStack>
)

const PerformanceRow: React.FC<{
  category: string;
  total: { percentage: string; count: number | string };
  subcategories: Array<{ label: string; percentage: string; count: number | string }>
}> = ({ category, total, subcategories }) => (
  <YStack gap={12}>
    <XStack justifyContent="space-between" alignItems="center">
      <Text.MD medium>{category}</Text.MD>
      <XStack gap="$small" alignItems="center">
        <Text.MD semibold secondary>{total.percentage}</Text.MD>
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

const GlobalStatsCard: React.FC<{ stats: RestPublicationStatsResponse }> = ({ stats }) => {
  const sentDate = new Date(stats.sent_at)
  const formattedDate = DateFormatter.format(sentDate, 'dd MMMM yyyy')
  const formattedTime = DateFormatter.format(sentDate, 'HH:mm')

  const openRate = stats.unique_opens.total_rate / 100
  const clickRate = stats.unique_clicks.total_rate / 100

  return (
    <VoxCard>
      <VoxCard.Content>
        <YStack gap="$medium">
          {/* Header Section */}
          <YStack gap="$small">
            <Text.MD color="$gray10">
              Envoyé à <Text.MD fontWeight="600">{stats.contacts}</Text.MD> contacts le{' '}
              <Text.MD fontWeight="600">{formattedDate}</Text.MD> à{' '}
              <Text.MD fontWeight="600">{formattedTime}</Text.MD>.
            </Text.MD>
            <Text.MD color="$gray10">
              Au total, <Text.MD fontWeight="600">{stats.visible_count}</Text.MD> peuvent la voir sur leur espace militant.
            </Text.MD>
          </YStack>

          {/* Statistics Grid */}
          <YStack gap="$small">
            {/* First row */}
            <XStack gap="$small">
              <StatCard value={stats.unique_notifications} label="Notifications" />
              <StatCard value={stats.unique_emails} label="Emails" />
              <StatCard value={stats.unique_impressions.total} label="Impressions" />
            </XStack>

            {/* Second row */}
            <XStack gap="$small">
              <StatCard value={NumberFormatter.formatPercent(openRate)} label="Ouvertures" />
              <StatCard value={NumberFormatter.formatPercent(clickRate)} label="Clics" />
            </XStack>
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const PerformanceDetailsCard: React.FC<{ stats: RestPublicationStatsResponse }> = ({ stats }) => {
  const openRate = stats.unique_opens.total_rate / 100
  const clickRate = stats.unique_clicks.total_rate / 100

  // Calcul des taux d'ouvertures par source
  const notificationOpenRate = stats.unique_opens.total > 0
    ? (stats.unique_opens.notification / stats.unique_opens.total) * 100
    : 0
  const timelineOpenRate = stats.unique_opens.total > 0
    ? (stats.unique_opens.timeline / stats.unique_opens.total) * 100
    : 0

  return (
    <VoxCard display="none">
      <VoxCard.Content>
        <YStack gap="$medium">
          <Text.LG semibold secondary>Détails de performance</Text.LG>

          <YStack gap={12}>
            <PerformanceRow
              category="Ouvertures uniques"
              total={{
                percentage: NumberFormatter.formatPercent(openRate),
                count: stats.unique_opens.total
              }}
              subcategories={[
                {
                  label: "Depuis la notification",
                  percentage: NumberFormatter.formatPercent(notificationOpenRate / 100),
                  count: stats.unique_opens.notification
                },
                {
                  label: "Depuis l'espace militant",
                  percentage: NumberFormatter.formatPercent(timelineOpenRate / 100),
                  count: stats.unique_opens.timeline
                },
                {
                  label: "Depuis l'email",
                  percentage: "0%",
                  count: "N/A"
                }
              ]}
            />

            <Separator borderColor="$textOutline" />

            <PerformanceRow
              category="Clics uniques"
              total={{
                percentage: NumberFormatter.formatPercent(clickRate),
                count: stats.unique_clicks.total
              }}
              subcategories={[
                {
                  label: "Depuis l'espace militant",
                  percentage: "0%",
                  count: "N/A"
                },
                {
                  label: "Depuis l'email",
                  percentage: "0%",
                  count: "N/A"
                }
              ]}
            />

            <Separator borderColor="$textOutline" />

            {/* Désabonnements */}
            <PerformanceRow
              category="Désabonnements aux emails"
              total={{
                percentage: "0%",
                count: "N/A"
              }}
              subcategories={[]}
            />
          </YStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const DefinitionsCard: React.FC<{ stats: RestPublicationStatsResponse }> = ({ stats }) => {
  return (
    <VoxCard display="none">
      <VoxCard.Content>
        <YStack gap="$small">
          <Text.SM lineHeight={20}>
            <Text.SM semibold>Uniques :</Text.SM> Tous les chiffres sont dédoublonnés au niveau du contact.
            Par exemple, si un militant ouvre la même publication 5 fois, cela compte pour une seule ouverture.
          </Text.SM>

          <Text.SM lineHeight={20}>
            <Text.SM semibold>Impressions :</Text.SM> Votre publication est vue sur l'accueil de l'espace militant.
          </Text.SM>

          <Text.SM lineHeight={20}>
            <Text.SM semibold>Ouvertures :</Text.SM> Votre publication est ouverte en entier.
            Le taux d'ouverture se calcule : Ouvertures / (contacts notifiés + impressions).
          </Text.SM>

          <Text.SM lineHeight={20}>
            <Text.SM semibold>Clics :</Text.SM> Un des liens contenu dans votre publication est cliqué.
            Le taux de clic se calcule : Clics / Ouvertures.
          </Text.SM>

          <Text.SM lineHeight={20}>
            <Text.SM semibold>Désabonnements :</Text.SM> Une personne se désabonne de nos emails depuis un de vos emails.
          </Text.SM>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export const PublicationGlobalStatsCards: React.FC<PublicationGlobalStatsCardsProps> = ({ stats }) => {
  return (
    <YStack gap="$medium">
      <GlobalStatsCard stats={stats} />
      <PerformanceDetailsCard stats={stats} />
      <DefinitionsCard stats={stats} />
    </YStack>
  )
}

export default PublicationGlobalStatsCards
