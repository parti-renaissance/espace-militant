import { useMedia } from 'tamagui'

import VerificationEmailDesktopScreen from '@/features/signup/pages/verification-email/components/VerificationEmailDesktopScreen'
import VerificationEmailMobileScreen from '@/features/signup/pages/verification-email/components/VerificationEmailMobileScreen'

export default function VerificationEmailPage() {
  const media = useMedia()

  return media.gtSm ? <VerificationEmailDesktopScreen /> : <VerificationEmailMobileScreen />
}
