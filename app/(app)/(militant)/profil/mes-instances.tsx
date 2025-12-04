import { LandPlot } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import InstancesScreen from '@/features_next/profil/pages/instances'
import { Header } from '@/components/AppStructure'

export default function MesInstancesPage() {

  return (
    <>
      <Header title="Mes instances" icon={LandPlot} />
      <Layout.Container hideTabBar={true}>
        <InstancesScreen />
      </Layout.Container>
    </>
  )
}