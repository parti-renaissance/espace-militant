import { YStack } from 'tamagui'

import SignupMobileScrollShell from '@/features/signup/components/SignupMobileScrollShell'
import { useSignupBienvenueScreen } from '@/features/signup/hooks/useSignupBienvenueScreen'
import BienvenueTitleAndCta from '@/features/signup/pages/bienvenue/components/BienvenueTitleAndCta'
import BienvenueVideo from '@/features/signup/pages/bienvenue/components/BienvenueVideo'

export default function BienvenueMobileScreen() {
  const { data, isLoading, isError, isScreenFocused, handleContinue } = useSignupBienvenueScreen()

  return (
    <SignupMobileScrollShell footer={<BienvenueTitleAndCta onContinue={handleContinue} />} footerSpacerHeight={220}>
      <YStack flex={1} minHeight={0} width="100%">
        <BienvenueVideo data={data} isLoading={isLoading} isError={isError} isScreenFocused={isScreenFocused} fillAvailableSpace />
      </YStack>
    </SignupMobileScrollShell>
  )
}
