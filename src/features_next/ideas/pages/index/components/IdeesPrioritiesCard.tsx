import { YStack } from 'tamagui'
import { Flag, Rocket } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'

export type IdeesPrioritiesCardProps = {
  onExplore?: () => void
  onCampaignSite?: () => void
}

export default function IdeesPrioritiesCard({ onExplore, onCampaignSite }: IdeesPrioritiesCardProps) {
  return (
    <CallToActionCard
      icon={Flag}
      title="Nos priorités pour la France"
      description={
        <>
          Les 4 chantiers capitaux de Gabriel Attal pour préparer l&apos;avenir de la France : école, salaires, frontières, intelligence
          artificielle. Les 2 dettes à résorber : dette publique et dette climatique.
        </>
      }
      theme="purple"
    >
      <YStack gap="$small">
        <VoxButton theme="purple" variant="soft" onPress={onExplore}>
          Explorer nos engagements
        </VoxButton>
        <VoxButton theme="purple" variant="outlined" iconLeft={Rocket} onPress={onCampaignSite}>
          Notre site de campagne
        </VoxButton>
      </YStack>
    </CallToActionCard>
  )
}
