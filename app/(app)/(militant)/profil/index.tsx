
import Layout from '@/components/AppStructure/Layout/Layout'
import DashboardScreen from '@/features_next/profil/pages/dashboard'
import { Header } from '@/components/AppStructure'

export default function IndexPage() {
  return (
    <>
      <Layout.Container>
        <DashboardScreen />
      </Layout.Container>
    </>
  )
}
