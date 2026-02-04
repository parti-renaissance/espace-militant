import { LandPlot } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import InstancesScreen from '@/features_next/profil/pages/instances'

export default function MesInstancesPage() {
  return (
    <>
      <Header title="Mes instances" icon={LandPlot} />
      <Layout.Container alwaysShowScrollbar hideTabBar={true}>
        <InstancesScreen />
      </Layout.Container>
    </>
  )
}
