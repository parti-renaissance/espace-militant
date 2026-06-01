import { Redirect } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const { email, firstName, inlineError, isActivating, needsRedirect, onActivate } = useSignupVerificationEmailScreen()

  if (needsRedirect) {
    return <Redirect href="/(signup)/inscription" />
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
            onActivate={onActivate}
          />
        }
        footer={<SignupVerificationEmailFooter email={email} />}
      />
    </SignupDesktopPageShell>
  )
}
