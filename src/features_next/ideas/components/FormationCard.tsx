import { GraduationCap } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'
import { useRequireAuth } from '@/components/RequireAuth'

import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'

export default function FormationCard() {
  const { isAuth, redirectToSignup } = useRequireAuth()
  const { isPending, open: openFormation } = useOpenExternalContent({ slug: 'formation', utm_campaign: 'idees_formation' })

  return (
    <CallToActionCard icon={GraduationCap} title="je me forme" description="Se former pour mieux agir sur le terrain." theme="gray">
      <VoxButton theme="gray" variant="soft" loading={isPending} onPress={isAuth ? openFormation() : redirectToSignup}>
        Plateforme de formations
      </VoxButton>
    </CallToActionCard>
  )
}
