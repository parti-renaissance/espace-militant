import { XStack, YStack } from 'tamagui';
import { Flag, Rocket } from '@tamagui/lucide-icons'
import Text from '@/components/base/Text';
import { VoxButton } from '@/components/Button';
import { PLAAK_44_BOLD } from '../../../../theme/fonts';


const PURPLE_PRIMARY = '#4555d1'

export type PrioritiesCardProps = {
  onExplore?: () => void
  onCampaignSite?: () => void
}

export default function PrioritiesCard({ onExplore, onCampaignSite }: PrioritiesCardProps) {
  return (
    <YStack backgroundColor="$white1" borderRadius={16} padding="$medium" gap="$medium">
      <YStack gap="$small">
        <XStack gap="$small" alignItems="center">
          <XStack width={32} height={32} borderRadius={999} backgroundColor="#D8DCFF" alignItems="center" justifyContent="center">
            <Flag size={16} color={PURPLE_PRIMARY} />
          </XStack>
          <Text fontFamily={PLAAK_44_BOLD} fontSize={20} color="#27221F" letterSpacing={-0.8} flexShrink={1}>
            Nos priorités pour la France
          </Text>
        </XStack>
        <Text.SM color="#6E6764" multiline>
          Les 4 chantiers capitaux de la campagne de Gabriel Attal pour redevenir la première puissance européenne : école, salaires, frontières, intelligence
          artificielle.
        </Text.SM>
      </YStack>
      <XStack gap="$small" flexWrap="wrap">
        <VoxButton onPress={onExplore} backgroundColor="#EBEDFF" textColor="#27221F">
          Explorer nos idées
        </VoxButton>
        <VoxButton variant="outlined" iconLeft={Rocket} onPress={onCampaignSite} borderColor={PURPLE_PRIMARY} textColor={PURPLE_PRIMARY}>
          Notre site de campagne
        </VoxButton>
      </XStack>
    </YStack>
  )
}
