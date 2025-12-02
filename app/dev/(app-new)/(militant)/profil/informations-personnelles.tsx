import Layout from '@/components/Navigation/Layout'
import AccountScreen from '@/features_next/profil/pages/account'

export default function InformationsPersonnellesPage() {

  return (
    <Layout.Container hideTabBar={true}>
      <AccountScreen />
    </Layout.Container>
  )
}