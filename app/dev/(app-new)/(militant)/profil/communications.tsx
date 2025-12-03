import Layout from '@/components/Navigation/Layout'
import CommunicationsScreen from '@/features_next/profil/pages/communications'

export default function CommunicationsPage() {

  return (
    <Layout.Container hideTabBar={true}>
      <CommunicationsScreen />
    </Layout.Container>
  )
}