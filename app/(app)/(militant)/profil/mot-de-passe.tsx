import { KeyRound } from '@tamagui/lucide-icons'
import Layout from '@/components/AppStructure/Layout/Layout'
import PasswordScreen from '@/features_next/profil/pages/password'
import { Header } from '@/components/AppStructure'

export default function MotDePassePage() {

  return (
    <>
      <Header title="Mot de passe" icon={KeyRound} />
      <Layout.Container hideTabBar={true}>
        <PasswordScreen />
      </Layout.Container>
    </>
  )
} 