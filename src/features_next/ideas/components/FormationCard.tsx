import { XStack, YStack } from 'tamagui'
import { GraduationCap } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import { PLAAK_44_BOLD } from '../../../../theme/fonts'

export type FormationCardProps = {
  onPress?: () => void
}

export default function FormationCard({ onPress }: FormationCardProps) {
  return (
    <YStack backgroundColor="$white1" borderRadius={16} padding="$medium" gap="$medium">
      <YStack gap="$small">
        <XStack gap="$small" alignItems="center">
          <XStack width={32} height={32} borderRadius={999} backgroundColor="#E6E2DF" alignItems="center" justifyContent="center">
            <GraduationCap size={16} color="#6E6764" />
          </XStack>
          <Text fontFamily={PLAAK_44_BOLD} fontSize={20} color="#27221F" letterSpacing={-0.8} flexShrink={1}>
            je me forme
          </Text>
        </XStack>
        <Text.SM color="#6E6764" multiline>
          Se former pour mieux agir sur le terrain.
        </Text.SM>
      </YStack>
      <XStack>
        <VoxButton onPress={onPress} backgroundColor="#F6F0EA" textColor="#27221F">
          Plateforme de formations
        </VoxButton>
      </XStack>
    </YStack>
  )
}
