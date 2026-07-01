import { TreeDeciduous } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import EluScreen from '@/features/profil/pages/elu'

export default function InformationsEluPage() {
  return (
    <>
      <Header title="Informations élu" icon={TreeDeciduous} />
      <Layout.Container alwaysShowScrollbar hideTabBar={true}>
        <EluScreen />
      </Layout.Container>
    </>
  )
}
