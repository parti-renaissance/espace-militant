import { XStack } from 'tamagui'
import { Flag, Rocket } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'

export type PrioritiesCardProps = {
  onExplore?: () => void
  onCampaignSite?: () => void
}

export default function PrioritiesCard({ onExplore, onCampaignSite }: PrioritiesCardProps) {
  return (
    <CallToActionCard
      icon={Flag}
      title="Nos priorités pour la France"
      description="Les 4 chantiers capitaux de la campagne de Gabriel Attal pour redevenir la première puissance européenne : école, salaires, frontières, intelligence artificielle."
      theme="purple"
    >
      <XStack gap="$small" flexWrap="wrap">
        <VoxButton theme="purple" variant="soft" onPress={onExplore}>
          Explorer nos idées
        </VoxButton>
        <VoxButton theme="purple" variant="outlined" iconLeft={Rocket} onPress={onCampaignSite}>
          Notre site de campagne
        </VoxButton>
      </XStack>
    </CallToActionCard>
  )
}
