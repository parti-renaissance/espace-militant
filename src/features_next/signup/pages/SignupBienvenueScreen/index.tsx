import { Redirect } from 'expo-router'
import { useMedia } from 'tamagui'

import { useUnauthGuard } from '@/features_next/signup/hooks/useUnauthGuard'
import SignupBienvenueDesktopScreen from '@/features_next/signup/pages/SignupBienvenueScreen/SignupBienvenueDesktopScreen'
import SignupBienvenueMobileScreen from '@/features_next/signup/pages/SignupBienvenueScreen/SignupBienvenueMobileScreen'

export default function SignupBienvenueScreen() {
  const media = useMedia()
  const { isWaiting, shouldRedirect } = useUnauthGuard()

  if (isWaiting) return null
  if (shouldRedirect) return <Redirect href="/" />

  return media.gtSm ? <SignupBienvenueDesktopScreen /> : <SignupBienvenueMobileScreen />
}
