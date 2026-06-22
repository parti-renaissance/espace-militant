import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  SignupDesktopFormColumn,
  SignupDesktopIllustrationColumn,
  SignupDesktopPageShell,
} from '@/features_next/signup/components/SignupDesktopLayout'
import { useSignupInscriptionScreen } from '@/features_next/signup/hooks/useSignupInscriptionScreen'
import SignupInscriptionActions from '@/features_next/signup/pages/inscription/components/SignupInscriptionActions'
import SignupInscriptionScrollBody from '@/features_next/signup/pages/inscription/components/SignupInscriptionScrollBody'

export default function InscriptionDesktopScreen() {
  const insets = useSafeAreaInsets()
  const { formRef, isSubmitting, handleSkip, handleSuccess } = useSignupInscriptionScreen()

  return (
    <SignupDesktopPageShell paddingLeft={insets.left + 16}>
      <SignupDesktopIllustrationColumn />
      <SignupDesktopFormColumn
        paddingRight={insets.right + 32}
        paddingBottom={insets.bottom + 16}
        scrollContent={<SignupInscriptionScrollBody formRef={formRef} onSuccess={handleSuccess} showEngagementCard={false} />}
        footer={<SignupInscriptionActions formRef={formRef} isSubmitting={isSubmitting} onSkip={handleSkip} />}
      />
    </SignupDesktopPageShell>
  )
}
