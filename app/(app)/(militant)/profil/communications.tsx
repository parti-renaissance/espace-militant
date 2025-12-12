import { MessageCircle } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import CommunicationsScreen from '@/features_next/profil/pages/communications'
import { Header } from '@/components/AppStructure'

export default function CommunicationsPage() {

  return (
    <>
      <Header title="Communications" icon={MessageCircle} />
      <Layout.Container alwaysShowScrollbar hideTabBar={true}>
        <CommunicationsScreen />
      </Layout.Container>
    </>
  )
}