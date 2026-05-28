import { Lightbulb } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'

export type ShareIdeaCardProps = {
  onPress?: () => void
}

export default function ShareIdeaCard({ onPress }: ShareIdeaCardProps) {
  return (
    <CallToActionCard
      icon={Lightbulb}
      title="je Partage une idée"
      description="Votre voix compte : soumettez vos propositions."
      theme="green"
    >
      <VoxButton theme="green" variant="soft" onPress={onPress}>
        Déposer une idée
      </VoxButton>
    </CallToActionCard>
  )
}
