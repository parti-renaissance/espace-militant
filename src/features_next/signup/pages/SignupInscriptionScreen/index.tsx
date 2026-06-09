import { Redirect } from 'expo-router'
import { useMedia } from 'tamagui'

import { useUnauthGuard } from '@/features_next/signup/hooks/useUnauthGuard'
import SignupInscriptionDesktopScreen from '@/features_next/signup/pages/SignupInscriptionScreen/SignupInscriptionDesktopScreen'
import SignupInscriptionMobileScreen from '@/features_next/signup/pages/SignupInscriptionScreen/SignupInscriptionMobileScreen'

export default function SignupInscriptionScreen() {
  const media = useMedia()
  const { isWaiting, shouldRedirect } = useUnauthGuard()

  if (isWaiting) return null
  if (shouldRedirect) return <Redirect href="/" />

  return media.gtSm ? <SignupInscriptionDesktopScreen /> : <SignupInscriptionMobileScreen />
}
