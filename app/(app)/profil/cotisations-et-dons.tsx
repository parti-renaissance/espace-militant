import { HelpingHand } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import DonationsScreen from '@/features_next/profil/pages/donations'

export default function CotisationsEtDonsPage() {
  return (
    <>
      <Header title="Cotisations et dons" icon={HelpingHand} />
      <Layout.Container alwaysShowScrollbar hideTabBar={true}>
        <DonationsScreen />
      </Layout.Container>
    </>
  )
}
