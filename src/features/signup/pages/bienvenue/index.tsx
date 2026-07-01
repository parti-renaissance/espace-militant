import { Redirect } from 'expo-router'
import { useMedia } from 'tamagui'

import { useUnauthGuard } from '@/features/signup/hooks/useUnauthGuard'
import BienvenueDesktopScreen from '@/features/signup/pages/bienvenue/components/BienvenueDesktopScreen'
import BienvenueMobileScreen from '@/features/signup/pages/bienvenue/components/BienvenueMobileScreen'

export default function BienvenuePage() {
  const media = useMedia()
  const { isWaiting, shouldRedirect } = useUnauthGuard()

  if (isWaiting) return null
  if (shouldRedirect) return <Redirect href="/" />

  return media.gtSm ? <BienvenueDesktopScreen /> : <BienvenueMobileScreen />
}
