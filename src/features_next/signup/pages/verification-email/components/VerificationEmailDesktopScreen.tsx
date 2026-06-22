import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'

import { SignupDesktopFormColumn, SignupDesktopIllustrationColumn, SignupDesktopPageShell } from '@/features_next/signup/components/SignupDesktopLayout'
import { useSignupVerificationEmailScreen } from '@/features_next/signup/hooks/useSignupVerificationEmailScreen'
import SignupVerificationEmailFooter from '@/features_next/signup/pages/verification-email/components/SignupVerificationEmailFooter'
import SignupVerificationEmailScrollBody from '@/features_next/signup/pages/verification-email/components/SignupVerificationEmailScrollBody'
import { AuthRoutes } from '@/features_next/signup/utils/authNavigation'

export default function VerificationEmailDesktopScreen() {
  const insets = useSafeAreaInsets()
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
    <SignupDesktopPageShell paddingLeft={insets.left + 16}>
      <SignupDesktopIllustrationColumn />
      <SignupDesktopFormColumn
        stickyFooter={false}
        paddingRight={insets.right + 32}
        paddingBottom={insets.bottom + 16}
        scrollContent={
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
        }
        footer={requiresManualLogin ? undefined : <SignupVerificationEmailFooter email={email} />}
      />
    </SignupDesktopPageShell>
  )
}
