import { Fragment } from 'react'
import Text from '@/components/base/Text'
import _EmptyState from '@/components/EmptyStates/EmptyState'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestElectedProfileResponse } from '@/services/profile/schema'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { XStack, YStack } from 'tamagui'

const EmptyState = () => {
  return (
    <_EmptyState>
      <YStack gap="$medium">
        <Text.MD semibold>Aucun paiement pour le moment</Text.MD>
      </YStack>
    </_EmptyState>
  )
}

const CotisationHistoryEluCard = ({ payments: data }: { payments: RestElectedProfileResponse['payments'] }) => {
  return (
    <VoxCard>
      <VoxCard.Content>
        <Text.LG>Historique de paiements</Text.LG>
        <VoxCard bg="$textSurface" inside>
          <VoxCard.Content>
            {data && data.length > 0 ? (
              data.map((payment) => (
                <Fragment key={payment.uuid}>
                  <XStack gap="$small" flex={1}>
                    <Text.MD semibold>{format(payment.date, 'dd MMM yyyy', { locale: fr })}</Text.MD>
                    <Text.MD secondary>
                      {payment.method.toUpperCase()} • {payment.status_label}
                    </Text.MD>
                    <XStack flex={1} justifyContent="flex-end">
                      <Text.MD primary={false} theme="orange">
                        {payment.amount}€
                      </Text.MD>
                    </XStack>
                  </XStack>
                  <VoxCard.Separator borderColor="$gray/32" />
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

export default CotisationHistoryEluCard
