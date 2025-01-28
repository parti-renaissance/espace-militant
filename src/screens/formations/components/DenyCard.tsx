import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { FormationScreenProps } from '@/screens/formations/types'
import { Image, XStack, YStack } from 'tamagui'

export const FormationDenyCard: FormationScreenProps = () => {
  const { isPending, open: openAdh } = useOpenExternalContent({ slug: 'adhesion' })
  return (
    <VoxCard.Content>
      <YStack alignItems="center" justifyContent="center" paddingVertical="$xxlarge" gap="$xlarge">
        <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
        <Text.LG>Les formations sont réservées aux adhérents.</Text.LG>
        <XStack>
          <VoxButton loading={isPending} onPress={openAdh({ state: '/formations' })} theme="yellow">
            J'adhère dès maintenant !
          </VoxButton>
        </XStack>
      </YStack>
    </VoxCard.Content>
  )
}
