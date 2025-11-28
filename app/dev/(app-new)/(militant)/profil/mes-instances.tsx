import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import InstancesScreen from '@/features_next/profil/pages/instances'

export default function MesInstancesPage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <InstancesScreen />
    </Layout.Container>
  )
}