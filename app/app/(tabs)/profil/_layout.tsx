import { useSession } from '@/ctx/SessionProvider'
import ProfilRouter from '@/features/profil/router/Router'
import { Redirect, Slot } from 'expo-router'
import { useMedia } from 'tamagui'

export default function AppLayout() {
  const { isAuth } = useSession()
  const media = useMedia()

  if (!isAuth) {
    return <Redirect href={'/(app)/(tabs)/evenements/'} />
  }

  return media.sm ? <Slot /> : <ProfilRouter />
}
