import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import RenewMembershipButton from '@/features/profil/pages/donations/components/RenewMembershipButton'
import { FormationScreenProps } from '@/screens/formations/types'
import { Image, XStack, YStack } from 'tamagui'

export const FormationDenyCard: FormationScreenProps = () => {
  return (
    <VoxCard.Content>
      <YStack alignItems="center" justifyContent="center" paddingVertical="$xxlarge" gap="$xlarge">
        <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
        <Text.LG>Les formations sont réservées aux adhérents.</Text.LG>
        <XStack>
          <RenewMembershipButton text="J'adhère dès maintenant !" page="formation" state="/formations" />
        </XStack>
      </YStack>
    </VoxCard.Content>
  )
}
