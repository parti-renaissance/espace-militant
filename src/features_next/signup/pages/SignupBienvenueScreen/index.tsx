import { useMedia } from 'tamagui'

import SignupBienvenueDesktopScreen from '@/features_next/signup/pages/SignupBienvenueScreen/SignupBienvenueDesktopScreen'
import SignupBienvenueMobileScreen from '@/features_next/signup/pages/SignupBienvenueScreen/SignupBienvenueMobileScreen'

export default function SignupBienvenueScreen() {
  const media = useMedia()

  return media.gtSm ? <SignupBienvenueDesktopScreen /> : <SignupBienvenueMobileScreen />
}
