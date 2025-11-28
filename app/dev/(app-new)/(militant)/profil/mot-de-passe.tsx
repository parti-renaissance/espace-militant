import Layout from '@/components/Navigation/Layout'
import { useHideTabBar } from '@/components/Navigation/LayoutContext'
import PasswordScreen from '@/features_next/profil/pages/password'

export default function MotDePassePage() {
  useHideTabBar()

  return (
    <Layout.Container>
      <PasswordScreen />
    </Layout.Container>
  )
} 