import Layout from '@/components/AppStructure/Layout/Layout'
import { Sparkle } from '@tamagui/lucide-icons'
import { Header } from '@/components/AppStructure'
import ExecutiveAccessesScreen from '@/features_next/profil/pages/executive-accesses'

export default function AccesCadrePage() {

  return (
    <>
      <Header title="Accès cadre" icon={Sparkle} />
      <Layout.Container hideTabBar={true}>
        <ExecutiveAccessesScreen />
      </Layout.Container>
    </>
  )
}
