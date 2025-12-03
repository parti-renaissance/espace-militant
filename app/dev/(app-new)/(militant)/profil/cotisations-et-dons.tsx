
import Layout from '@/components/AppStructure/Layout/Layout'
import DonationsScreen from '@/features_next/profil/pages/donations'


export default function CotisationsEtDonsPage() {

  return (
    <Layout.Container hideTabBar={true}>
      <DonationsScreen />
    </Layout.Container>
  )
}