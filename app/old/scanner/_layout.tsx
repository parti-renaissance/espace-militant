import { Redirect, Slot } from 'expo-router'
import { useSession } from '@/ctx/SessionProvider'

export default function AppLayout() {
  const { isAuth } = useSession()

  if (!isAuth) {
    return <Redirect href={'/'} />
  }

  return <Slot />
}
