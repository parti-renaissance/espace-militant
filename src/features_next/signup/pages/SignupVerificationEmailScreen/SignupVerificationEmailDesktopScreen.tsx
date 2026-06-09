import { Redirect } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AuthRoutes } from '@/features_next/signup/utils/authNavigation'
import {
  SignupDesktopFormColumn,
  SignupDesktopIllustrationColumn,
  SignupDesktopPageShell,
} from '@/features_next/signup/components/SignupDesktopLayout'
import { useSignupVerificationEmailScreen } from '@/features_next/signup/hooks/useSignupVerificationEmailScreen'
import SignupVerificationEmailFooter from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/SignupVerificationEmailFooter'
import SignupVerificationEmailScrollBody from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/SignupVerificationEmailScrollBody'

export default function SignupVerificationEmailDesktopScreen() {
  const insets = useSafeAreaInsets()
  const { email, firstName, inlineError, isActivating, requiresManualLogin, needsRedirect, onActivate, onStartEditingCode, onSignIn } =
    useSignupVerificationEmailScreen()

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
            requiresManualLogin={requiresManualLogin}
            onActivate={onActivate}
            onStartEditingCode={onStartEditingCode}
            onSignIn={onSignIn}
          />
        }
        footer={requiresManualLogin ? undefined : <SignupVerificationEmailFooter email={email} />}
      />
    </SignupDesktopPageShell>
  )
}
