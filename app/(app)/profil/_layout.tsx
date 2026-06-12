import { Redirect, Slot } from 'expo-router'

import { useSession } from '@/ctx/SessionProvider'

export default function ProfilLayout() {
  const { isAuth, isLoggingOut } = useSession()

  if (isLoggingOut) {
    return null
  }

  if (!isAuth) {
    return <Redirect href={'/evenements'} />
  }

  return <Slot />
}
