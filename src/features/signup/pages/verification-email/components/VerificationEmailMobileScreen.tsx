import { Redirect } from 'expo-router'

import SignupMobileScrollShell from '@/features/signup/components/SignupMobileScrollShell'
import { useSignupVerificationEmailScreen } from '@/features/signup/hooks/useSignupVerificationEmailScreen'
import SignupVerificationEmailFooter from '@/features/signup/pages/verification-email/components/SignupVerificationEmailFooter'
import SignupVerificationEmailScrollBody from '@/features/signup/pages/verification-email/components/SignupVerificationEmailScrollBody'
import { AuthRoutes } from '@/features/signup/utils/authNavigation'

export default function VerificationEmailMobileScreen() {
  const {
    email,
    firstName,
    inlineError,
    isActivating,
    isChangingEmail,
    requiresManualLogin,
    needsRedirect,
    onActivate,
    onStartEditingCode,
    onChangeEmail,
    onSignIn,
  } = useSignupVerificationEmailScreen()

  if (needsRedirect) {
    return <Redirect href={AuthRoutes.INSCRIPTION} />
  }

  return (
    <SignupMobileScrollShell gap="$medium" footer={!requiresManualLogin ? <SignupVerificationEmailFooter email={email} /> : undefined}>
      <SignupVerificationEmailScrollBody
        email={email}
        firstName={firstName}
        inlineError={inlineError}
        isActivating={isActivating}
        isChangingEmail={isChangingEmail}
        requiresManualLogin={requiresManualLogin}
        onActivate={onActivate}
        onStartEditingCode={onStartEditingCode}
        onChangeEmail={onChangeEmail}
        onSignIn={onSignIn}
      />
    </SignupMobileScrollShell>
  )
}
