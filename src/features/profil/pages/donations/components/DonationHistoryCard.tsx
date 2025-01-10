import { Fragment } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import _EmptyState from '@/components/EmptyStates/EmptyState'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useGetDonations } from '@/services/profile/hook'
import { RestDonationsResponse } from '@/services/profile/schema'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { XStack, YStack } from 'tamagui'

const isRecuDonation = (x: RestDonationsResponse[number]) => x.status === 'subscription_in_progress'
const getType = (x: RestDonationsResponse[number]) => {
  if (isRecuDonation(x)) {
    return 'Don mensuel'
  }
  return x.membership ? 'Cotisation' : 'Don'
}

const EmptyState = () => {
  const donationLink = useOpenExternalContent({ slug: 'donation' })
  const subscriptionLink = useOpenExternalContent({ slug: 'adhesion' })

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
              data.map((donation, i) => (
                <Fragment key={donation.uuid}>
                  <XStack gap="$small" flex={1}>
                    <Text.MD semibold>{format(donation.date, 'dd MMM yyyy', { locale: fr })}</Text.MD>
                    <Text.MD secondary>
                      {getType(donation)} • {donation.type.toUpperCase()}
                    </Text.MD>
                    <XStack flex={1} justifyContent="flex-end">
                      <Text.MD primary={false} semibold theme={donation.membership ? 'blue' : 'green'}>
                        {donation.amount.toFixed(2)} €
                      </Text.MD>
                    </XStack>
                  </XStack>
                  {i < data.length - 1 && <VoxCard.Separator borderColor="$gray/32" />}
                </Fragment>
              ))
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
