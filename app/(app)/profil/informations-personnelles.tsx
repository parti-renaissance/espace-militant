import { Settings2 } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import AccountScreen from '@/features/profil/pages/account'

export default function InformationsPersonnellesPage() {
  return (
    <>
      <Header title="Informations personnelles" icon={Settings2} />
      <Layout.Container alwaysShowScrollbar hideTabBar={true}>
        <AccountScreen />
      </Layout.Container>
    </>
  )
}
