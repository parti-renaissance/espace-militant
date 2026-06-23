import { useMedia } from 'tamagui'

import VerificationEmailDesktopScreen from '@/features_next/signup/pages/verification-email/components/VerificationEmailDesktopScreen'
import VerificationEmailMobileScreen from '@/features_next/signup/pages/verification-email/components/VerificationEmailMobileScreen'

export default function VerificationEmailPage() {
  const media = useMedia()

  return media.gtSm ? <VerificationEmailDesktopScreen /> : <VerificationEmailMobileScreen />
}
