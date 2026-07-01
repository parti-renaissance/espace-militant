import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import RenewMembershipButton from '@/features/profil/pages/donations/components/RenewMembershipButton'
import { HIT_SOURCES } from '@/services/hits/constants'
import { FormationScreenProps } from '@/screens/formations/types'
import { Image, XStack, YStack } from 'tamagui'

import visuCadnasImg from '@/assets/illustrations/VisuCadnas.png'

export const FormationDenyCard: FormationScreenProps = () => {
  return (
    <VoxCard.Content>
      <YStack alignItems="center" justifyContent="center" paddingVertical="$xxlarge" gap="$xlarge">
        <Image src={visuCadnasImg} />
        <Text.LG>Les formations sont réservées aux adhérents.</Text.LG>
        <XStack>
          <RenewMembershipButton
            text="J'adhère dès maintenant !"
            page="formation"
            state="/formations"
            hitSource={HIT_SOURCES.PAGE_FORMATIONS}
          />
        </XStack>
      </YStack>
    </VoxCard.Content>
  )
}
