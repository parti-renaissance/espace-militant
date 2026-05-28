import { XStack, YStack } from 'tamagui';
import { Lightbulb } from '@tamagui/lucide-icons'
import Text from '@/components/base/Text';
import { VoxButton } from '@/components/Button';
import { PLAAK_44_BOLD } from '../../../../theme/fonts';

export type ShareIdeaCardProps = {
  onPress?: () => void
}

export default function ShareIdeaCard({ onPress }: ShareIdeaCardProps) {
  return (
    <YStack backgroundColor="$white1" borderRadius={16} padding="$medium" gap="$medium">
      <YStack gap="$small">
        <XStack gap="$small" alignItems="center">
          <XStack width={32} height={32} borderRadius={999} backgroundColor="#BCEFC3" alignItems="center" justifyContent="center">
            <Lightbulb size={16} color="#1F7A33" />
          </XStack>
          <Text fontFamily={PLAAK_44_BOLD} fontSize={20} color="#27221F" letterSpacing={-0.8} flexShrink={1}>
            je Partage une idée
          </Text>
        </XStack>
        <Text.SM color="#6E6764" multiline>
          Votre voix compte : soumettez vos propositions.
        </Text.SM>
      </YStack>
      <XStack>
        <VoxButton onPress={onPress} backgroundColor="#E0F8E3" textColor="#27221F">
          Déposer une idée
        </VoxButton>
      </XStack>
    </YStack>
  )
}
