import { TreeDeciduous } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import EluScreen from '@/features_next/profil/pages/elu'
import { Header } from '@/components/AppStructure'

export default function InformationsEluPage() {

  return (
    <>
      <Header title="Informations élu" icon={TreeDeciduous} />
      <Layout.Container hideTabBar={true}>
        <EluScreen />
      </Layout.Container>
    </>
  )
}