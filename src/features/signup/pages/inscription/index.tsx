import { Redirect } from 'expo-router'
import { useMedia } from 'tamagui'

import { useUnauthGuard } from '@/features/signup/hooks/useUnauthGuard'
import InscriptionDesktopScreen from '@/features/signup/pages/inscription/components/InscriptionDesktopScreen'
import InscriptionMobileScreen from '@/features/signup/pages/inscription/components/InscriptionMobileScreen'

export default function InscriptionPage() {
  const media = useMedia()
  const { isWaiting, shouldRedirect } = useUnauthGuard()

  if (isWaiting) return null
  if (shouldRedirect) return <Redirect href="/" />

  return media.gtSm ? <InscriptionDesktopScreen /> : <InscriptionMobileScreen />
}
