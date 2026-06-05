import { YStack } from 'tamagui';
import { Flag, Rocket } from '@tamagui/lucide-icons';

import { VoxButton } from '@/components/Button';
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard';

export type PrioritiesCardProps = {
  onExplore?: () => void
  onCampaignSite?: () => void
}

export default function PrioritiesCard({ onExplore, onCampaignSite }: PrioritiesCardProps) {
  return (
    <CallToActionCard
      icon={Flag}
      title="Nos priorités pour la France"
      description={
        <>
          Les 4 chantiers capitaux de Gabriel Attal pour préparer l'avenir de la France : école, salaires,{' '}
          frontières, intelligence artificielle. Les 2 dettes à résorber : dette publique et{' '}
          dette climatique.
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
