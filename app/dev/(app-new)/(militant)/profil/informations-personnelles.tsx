import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import AccountScreen from '@/features_next/profil/pages/account'

export default function InformationsPersonnellesPage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <AccountScreen />
    </Layout.Container>
  )
}