import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import EluScreen from '@/features_next/profil/pages/elu'

export default function InformationsEluPage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <EluScreen />
    </Layout.Container>
  )
}