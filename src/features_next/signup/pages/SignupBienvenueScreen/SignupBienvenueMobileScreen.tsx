import BienvenueTitleAndCta from '@/features_next/signup/pages/SignupBienvenueScreen/components/BienvenueTitleAndCta'
import BienvenueVideo from '@/features_next/signup/pages/SignupBienvenueScreen/components/BienvenueVideo'
import SignupMobileScrollShell from '@/features_next/signup/components/SignupMobileScrollShell'
import { useSignupBienvenueScreen } from '@/features_next/signup/hooks/useSignupBienvenueScreen'

export default function SignupBienvenueMobileScreen() {
  const { data, isLoading, isError, isScreenFocused, handleContinue } = useSignupBienvenueScreen()

  return (
    <SignupMobileScrollShell>
      <BienvenueVideo data={data} isLoading={isLoading} isError={isError} isScreenFocused={isScreenFocused} />
      <BienvenueTitleAndCta onContinue={handleContinue} />
    </SignupMobileScrollShell>
  )
}
