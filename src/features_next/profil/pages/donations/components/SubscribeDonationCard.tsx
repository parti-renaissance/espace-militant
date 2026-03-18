import { XStack, YStack } from 'tamagui'
import { Crown } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { AlertUtils } from '@/screens/shared/AlertUtils'
import { useCancelDonation } from '@/services/profile/hook'
import type { RestDonationsResponse } from '@/services/profile/schema'
import { getHumanFormattedDate } from '@/utils/date'

export default function (props: { subscription: RestDonationsResponse[number]; full?: boolean }) {
  const { isPending, open: handlePress } = useOpenExternalContent({ slug: 'donation' })
  const { mutate: cancelDonation, isPending: isCancelPending } = useCancelDonation()

  const subscriptionDate = props.subscription?.date ? new Date(props.subscription.date) : null
  const isValidDate = subscriptionDate !== null && !Number.isNaN(subscriptionDate.getTime())

  const handleCancel = () => {
    AlertUtils.showDestructiveAlert('Confirmation', 'Êtes-vous sûr de vouloir annuler votre don ?', 'Oui', 'Non', () => {
      cancelDonation()
    })
  }

  return (
    <VoxCard bg="$green1" inside>
      <VoxCard.Content>
        <XStack gap="$medium">
          <YStack flex={1} gap="$medium">
            <VoxCard.Chip outlined theme="green" icon={Crown}>
              Financeur
            </VoxCard.Chip>
            <YStack gap="$medium" flex={1}>
              <VoxCard inside>
                <VoxCard.Content>
                  <XStack alignItems="center" flex={1}>
                    <YStack gap="$small" flex={2}>
                      {isValidDate && (
                        <Text.SM semibold color="$green6">
                          Vous êtes financeur depuis le {getHumanFormattedDate(subscriptionDate)}
                        </Text.SM>
                      )}
                      <Text.MD secondary color="$green6">
                        Un don de <Text.LG color="$green6">{props.subscription?.amount ?? 'Oups'} €</Text.LG> est programmé mensuellement.
                      </Text.MD>
                    </YStack>
                    <YStack justifyContent="center">
                      <Crown size="$5" color="$green6" strokeWidth={1} />
                    </YStack>
                  </XStack>
                </VoxCard.Content>
              </VoxCard>
              <XStack gap="$small">
                <VoxButton size="lg" theme="green" onPress={handlePress({ duration: '0' })} disabled={isPending} loading={isPending}>
                  Faire un don
                </VoxButton>
                <VoxButton size="lg" theme="green" variant="text" bg="white" onPress={handleCancel} disabled={isCancelPending} loading={isCancelPending}>
                  Annuler
                </VoxButton>
              </XStack>
            </YStack>
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
