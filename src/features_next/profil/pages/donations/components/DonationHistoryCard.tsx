import { Fragment } from 'react'
import { XStack, YStack } from 'tamagui'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import Text from '@/components/base/Text'
import { formatShortDate } from '@/utils/DateFormatter'
import { VoxButton } from '@/components/Button'
import _EmptyState from '@/components/EmptyStates/EmptyState'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useGetDonations } from '@/services/profile/hook'
import { RestDonationsResponse } from '@/services/profile/schema'

const getType = (x: RestDonationsResponse[number]) => x.type_label || x.type

const EmptyState = () => {
  const donationLink = useOpenExternalContent({ slug: 'donation' })
  const subscriptionLink = useOpenExternalContent({ slug: 'adhesion', utm_campaign: 'profil' })

  return (
    <_EmptyState>
      <YStack gap="$medium">
        <Text.MD semibold>Aucun paiement pour le moment</Text.MD>
        <XStack gap="$small" justifyContent="space-between">
          <VoxButton variant="text" theme="yellow" size="lg" loading={subscriptionLink.isPending} onPress={subscriptionLink.open()}>
            Adhérer
          </VoxButton>
          <VoxButton variant="text" theme="green" size="lg" loading={donationLink.isPending} onPress={donationLink.open({ duration: '0' })}>
            Donner
          </VoxButton>
        </XStack>
      </YStack>
    </_EmptyState>
  )
}

const DonationHistoryCard = () => {
  const { data, isPending } = useGetDonations()
  if (isPending) {
    return (
      <SkeCard>
        <SkeCard.Content>
          <SkeCard.Title />
          <SkeCard.Content>
            <SkeCard.Description />
          </SkeCard.Content>
        </SkeCard.Content>
      </SkeCard>
    )
  }
  return (
    <VoxCard>
      <VoxCard.Content>
        <Text.LG>Historique de paiements</Text.LG>
        <VoxCard bg="$textSurface" inside>
          <VoxCard.Content>
            {data && data.length > 0 ? (
              data.map((donation, i) => {
                const dateObj = new Date(donation.date)
                const dateLabel = Number.isNaN(dateObj.getTime())
                  ? formatShortDate(donation.date)
                  : format(dateObj, 'dd MMM yyyy', { locale: fr })
                return (
                <Fragment key={donation.uuid}>
                  <XStack gap="$small" flex={1}>
                    <Text.MD semibold>{dateLabel}</Text.MD>
                    <Text.MD secondary>
                      {getType(donation)} • {donation.transaction_type_label}
                    </Text.MD>
                    <XStack flex={1} justifyContent="flex-end">
                      <Text.MD primary={false} semibold theme={donation.type === 'membership' ? 'blue' : 'green'}>
                        {donation.amount.toFixed(2)} €
                      </Text.MD>
                    </XStack>
                  </XStack>
                  {i < data.length - 1 && <VoxCard.Separator borderColor="$gray/32" />}
                </Fragment>
              )
              })
            ) : (
              <EmptyState />
            )}
          </VoxCard.Content>
        </VoxCard>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default DonationHistoryCard
