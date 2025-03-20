import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import RenewMembershipButton from '@/features/profil/pages/donations/components/RenewMembershipButton'
import { GeneralConventionScreenProps } from '@/screens/generalConventions/types'
import { Image, XStack, YStack } from 'tamagui'

export const GeneralConventionsDenyCard: GeneralConventionScreenProps = () => {
  return (
    <VoxCard inside boxSizing={'border-box'} padding={40} borderColor="$textOutline" borderWidth={1} background={'white'}>
      <VoxCard.Content>
        <YStack alignItems="center" justifyContent="center" paddingVertical="$xxlarge" gap="$xlarge">
          <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
          <Text.LG>Les états généraux sont réservés aux adhérents.</Text.LG>
          <XStack>
            <RenewMembershipButton text="J'adhère dès maintenant !" page="etats-generaux" state="/etats-generaux" />
          </XStack>
        </YStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
