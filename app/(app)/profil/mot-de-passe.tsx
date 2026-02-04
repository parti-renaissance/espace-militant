import { KeyRound } from '@tamagui/lucide-icons'

import { Header } from '@/components/AppStructure'
import Layout from '@/components/AppStructure/Layout/Layout'
import PasswordScreen from '@/features_next/profil/pages/password'

export default function MotDePassePage() {
  return (
    <>
      <Header title="Mot de passe" icon={KeyRound} />
      <Layout.Container alwaysShowScrollbar hideTabBar={true}>
        <PasswordScreen />
      </Layout.Container>
    </>
  )
}
