import { Redirect } from 'expo-router'
import { YStack } from 'tamagui'

import SignupMobileScrollShell from '@/features_next/signup/components/SignupMobileScrollShell'
import { useSignupVerificationEmailScreen } from '@/features_next/signup/hooks/useSignupVerificationEmailScreen'
import SignupVerificationEmailFooter from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/SignupVerificationEmailFooter'
import SignupVerificationEmailScrollBody from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/SignupVerificationEmailScrollBody'

export default function SignupVerificationEmailMobileScreen() {
  const { email, firstName, inlineError, isActivating, needsRedirect, onActivate, onStartEditingCode } =
    useSignupVerificationEmailScreen()

  if (needsRedirect) {
    return <Redirect href="/(signup)/inscription" />
  }

  return (
    <SignupMobileScrollShell gap="$medium">
      <YStack gap="$medium" width="100%">
        <SignupVerificationEmailScrollBody
          email={email}
          firstName={firstName}
          inlineError={inlineError}
          isActivating={isActivating}
          onActivate={onActivate}
          onStartEditingCode={onStartEditingCode}
        />
        <SignupVerificationEmailFooter email={email} />
      </YStack>
    </SignupMobileScrollShell>
  )
}
