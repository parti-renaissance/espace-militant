import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'

import { SignupDesktopFormColumn, SignupDesktopIllustrationColumn, SignupDesktopPageShell } from '@/features/signup/components/SignupDesktopLayout'
import { useSignupVerificationEmailScreen } from '@/features/signup/hooks/useSignupVerificationEmailScreen'
import SignupVerificationEmailFooter from '@/features/signup/pages/verification-email/components/SignupVerificationEmailFooter'
import SignupVerificationEmailScrollBody from '@/features/signup/pages/verification-email/components/SignupVerificationEmailScrollBody'
import { useInscriptionContent } from '@/features/signup/pages/inscription/hooks/useInscriptionContent'
import { AuthRoutes } from '@/features/signup/utils/authNavigation'

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
  const { DesktopIllustrationComponent } = useInscriptionContent()

  if (needsRedirect) {
    return <Redirect href={AuthRoutes.INSCRIPTION} />
  }

  return (
    <SignupDesktopPageShell paddingLeft={insets.left + 16}>
      <SignupDesktopIllustrationColumn illustration={DesktopIllustrationComponent ? <DesktopIllustrationComponent /> : undefined} />
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
