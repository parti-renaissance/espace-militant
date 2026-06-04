import { useMedia } from 'tamagui'

import SignupInscriptionDesktopScreen from '@/features_next/signup/pages/SignupInscriptionScreen/SignupInscriptionDesktopScreen'
import SignupInscriptionMobileScreen from '@/features_next/signup/pages/SignupInscriptionScreen/SignupInscriptionMobileScreen'

export default function SignupInscriptionScreen() {
  const media = useMedia()

  return media.gtSm ? <SignupInscriptionDesktopScreen /> : <SignupInscriptionMobileScreen />
}
