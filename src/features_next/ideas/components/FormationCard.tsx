import { GraduationCap } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'

export default function FormationCard() {
  const externalLink = useOpenExternalContent({ slug: 'formation' })

  return (
    <CallToActionCard
      icon={GraduationCap}
      title="je me forme"
      description="Se former pour mieux agir sur le terrain."
      theme="gray"
    >
      <VoxButton theme="gray" variant="soft" loading={externalLink.isPending} onPress={externalLink.open({})}>
        Plateforme de formations
      </VoxButton>
    </CallToActionCard>
  )
}
