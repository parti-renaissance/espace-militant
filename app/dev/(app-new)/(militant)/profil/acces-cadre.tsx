import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import ExecutiveAccessesScreen from '@/features_next/profil/pages/executive-accesses'

export default function AccesCadrePage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <ExecutiveAccessesScreen />
    </Layout.Container>
  )
}
