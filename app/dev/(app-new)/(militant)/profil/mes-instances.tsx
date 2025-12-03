import Layout from '@/components/AppStructure/Layout/Layout'
import InstancesScreen from '@/features_next/profil/pages/instances'

export default function MesInstancesPage() {

  return (
    <Layout.Container hideTabBar={true}>
      <InstancesScreen />
    </Layout.Container>
  )
}