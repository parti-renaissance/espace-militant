import { Redirect } from 'expo-router'

import SignupMobileScrollShell from '@/features_next/signup/components/SignupMobileScrollShell'
import { AuthRoutes } from '@/features_next/signup/utils/authNavigation'
import { useSignupVerificationEmailScreen } from '@/features_next/signup/hooks/useSignupVerificationEmailScreen'
import SignupVerificationEmailFooter from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/SignupVerificationEmailFooter'
import SignupVerificationEmailScrollBody from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/SignupVerificationEmailScrollBody'

export default function SignupVerificationEmailMobileScreen() {
  const { email, firstName, inlineError, isActivating, requiresManualLogin, needsRedirect, onActivate, onStartEditingCode, onSignIn } =
    useSignupVerificationEmailScreen()

  if (needsRedirect) {
    return <Redirect href={AuthRoutes.INSCRIPTION} />
  }

  return (
    <SignupMobileScrollShell
      gap="$medium"
      footer={!requiresManualLogin ? <SignupVerificationEmailFooter email={email} /> : undefined}
    >
      <SignupVerificationEmailScrollBody
        email={email}
        firstName={firstName}
        inlineError={inlineError}
        isActivating={isActivating}
        requiresManualLogin={requiresManualLogin}
        onActivate={onActivate}
        onStartEditingCode={onStartEditingCode}
        onSignIn={onSignIn}
      />
    </SignupMobileScrollShell>
  )
}
