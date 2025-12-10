import { HelpingHand } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import DonationsScreen from '@/features_next/profil/pages/donations'
import { Header } from '@/components/AppStructure'



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