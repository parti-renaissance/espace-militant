import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import CommunicationsScreen from '@/features_next/profil/pages/communications'

export default function CommunicationsPage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <CommunicationsScreen />
    </Layout.Container>
  )
}