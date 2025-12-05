import { useSession } from '@/ctx/SessionProvider'
import { Redirect, Slot } from 'expo-router'

export default function AppLayout() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/'} />
  }

  return <Slot />
}
