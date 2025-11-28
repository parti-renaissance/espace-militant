
import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import DashboardScreen from '@/features_next/profil/pages/dashboard'

export default function IndexPage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <DashboardScreen />
    </Layout.Container>
  )
}
