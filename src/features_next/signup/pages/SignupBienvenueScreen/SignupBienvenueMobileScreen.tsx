import BienvenueTitleAndCta from '@/features_next/signup/pages/SignupBienvenueScreen/components/BienvenueTitleAndCta'
import BienvenueVideo from '@/features_next/signup/pages/SignupBienvenueScreen/components/BienvenueVideo'
import SignupMobileScrollShell from '@/features_next/signup/components/SignupMobileScrollShell'
import { useSignupBienvenueScreen } from '@/features_next/signup/hooks/useSignupBienvenueScreen'
import { YStack } from 'tamagui'

export default function SignupBienvenueMobileScreen() {
  const { data, isLoading, isError, isScreenFocused, handleContinue } = useSignupBienvenueScreen()

  return (
    <SignupMobileScrollShell>
      <YStack flex={1} minHeight={0} width="100%" justifyContent="space-between" gap="$large">
        <YStack flex={1} minHeight={0} width="100%">
          <BienvenueVideo
            data={data}
            isLoading={isLoading}
            isError={isError}
            isScreenFocused={isScreenFocused}
            fillAvailableSpace
          />
        </YStack>
        <BienvenueTitleAndCta onContinue={handleContinue} />
      </YStack>
    </SignupMobileScrollShell>
  )
}
