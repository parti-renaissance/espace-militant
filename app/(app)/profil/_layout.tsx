import { useSession } from '@/ctx/SessionProvider'
import { Redirect } from 'expo-router'
import ProfilRouter from '@/features/profil/router/Router'

export default function AppLayout() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href="/(app)/(tabs)/evenements/" />
  }

  return <ProfilRouter />
}
