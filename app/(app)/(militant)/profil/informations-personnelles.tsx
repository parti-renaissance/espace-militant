import { Settings2 } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import AccountScreen from '@/features_next/profil/pages/account'
import { Header } from '@/components/AppStructure'

    
export default function InformationsPersonnellesPage() {

  return (
    <>
      <Header title="Informations personnelles" icon={Settings2} />
      <Layout.Container hideTabBar={true}>
        <AccountScreen />
      </Layout.Container>
    </>
  )
}