import Layout from '@/components/AppStructure/Layout/Layout'
import CommunicationsScreen from '@/features_next/profil/pages/communications'

export default function CommunicationsPage() {

  return (
    <Layout.Container hideTabBar={true}>
      <CommunicationsScreen />
    </Layout.Container>
  )
}