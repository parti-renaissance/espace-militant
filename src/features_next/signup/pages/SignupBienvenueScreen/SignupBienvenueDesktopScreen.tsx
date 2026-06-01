import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'

import { SignupDesktopPageShell } from '@/features_next/signup/components/SignupDesktopLayout'
import { useSignupBienvenueScreen } from '@/features_next/signup/hooks/useSignupBienvenueScreen'
import BienvenueTitleAndCta from '@/features_next/signup/pages/SignupBienvenueScreen/components/BienvenueTitleAndCta'
import BienvenueVideo from '@/features_next/signup/pages/SignupBienvenueScreen/components/BienvenueVideo'

export default function SignupBienvenueDesktopScreen() {
  const insets = useSafeAreaInsets()
  const { data, isLoading, isError, isScreenFocused, handleContinue } = useSignupBienvenueScreen()

  return (
    <SignupDesktopPageShell paddingLeft={insets.left + 16} maxWidth={872} maxHeight={700}>
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$xlarge" paddingLeft={insets.left + 32}>
        <BienvenueVideo data={data} isLoading={isLoading} isError={isError} isScreenFocused={isScreenFocused} maxHeight={620} />
      </YStack>

      <YStack flex={1} justifyContent="center" alignItems="center" paddingRight={insets.right + 32}>
        <BienvenueTitleAndCta onContinue={handleContinue} />
      </YStack>
    </SignupDesktopPageShell>
  )
}
