
import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import DonationsScreen from '@/features_next/profil/pages/donations'


export default function CotisationsEtDonsPage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <DonationsScreen />
    </Layout.Container>
  )
}