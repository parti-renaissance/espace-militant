import Layout from '@/components/Navigation/Layout'
import EluScreen from '@/features_next/profil/pages/elu'

export default function InformationsEluPage() {

  return (
    <Layout.Container hideTabBar={true}>
      <EluScreen />
    </Layout.Container>
  )
}