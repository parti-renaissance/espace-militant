import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { Image } from 'expo-image'
import { styled, XStack, YStack } from 'tamagui'

const HeaderFrame = styled(XStack, {
  padding: '$medium',
  paddingRight: 0,
  gap: '$large',
})

export default function (props: { full?: boolean }) {
  const { isPending, open: handlePress } = useOpenExternalContent({ slug: 'donation' })
  return (
    <VoxCard bg="$green1" inside>
      <HeaderFrame>
        <YStack gap="$medium" flex={1} flexBasis={0} flexGrow={2} maxWidth={360}>
          <YStack gap="$small">
            <Text.LG>Faites la différence.</Text.LG>
            <Text.MD secondary regular multiline>
              Devenez financeur du parti en faisant un don mensuel.
            </Text.MD>
          </YStack>
          <XStack gap="$small" flexWrap="wrap">
            <VoxButton theme="green" size="lg" onPress={handlePress({ duration: '-1' })} disabled={isPending}>
              Je finance le parti
            </VoxButton>
            <VoxButton theme="green" size="lg" variant="outlined" onPress={handlePress({ duration: '0' })} disabled={isPending}>
              Je donne
            </VoxButton>
          </XStack>
        </YStack>
        <Image
          style={{ width: '100%', flex: 1, flexBasis: 0 }}
          source={require('@/features/profil/assets/don-illu.png')}
          contentFit="contain"
          contentPosition="right"
        />
      </HeaderFrame>
    </VoxCard>
  )
}
