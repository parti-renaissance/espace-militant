import { useMedia } from 'tamagui'

import SignupVerificationEmailDesktopScreen from '@/features_next/signup/pages/SignupVerificationEmailScreen/SignupVerificationEmailDesktopScreen'
import SignupVerificationEmailMobileScreen from '@/features_next/signup/pages/SignupVerificationEmailScreen/SignupVerificationEmailMobileScreen'

export default function SignupVerificationEmailScreen() {
  const media = useMedia()

  return media.gtSm ? <SignupVerificationEmailDesktopScreen /> : <SignupVerificationEmailMobileScreen />
}
