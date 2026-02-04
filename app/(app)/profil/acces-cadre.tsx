import { Sparkle } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import ExecutiveAccessesScreen from '@/features_next/profil/pages/executive-accesses'

export default function AccesCadrePage() {
  return (
    <>
      <Header title="Accès cadre" icon={Sparkle} />
      <Layout.Container alwaysShowScrollbar hideTabBar={true}>
        <ExecutiveAccessesScreen />
      </Layout.Container>
    </>
  )
}
