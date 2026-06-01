import { YStack } from 'tamagui'

import SignupMobileScrollShell from '@/features_next/signup/components/SignupMobileScrollShell'
import { useSignupInscriptionScreen } from '@/features_next/signup/hooks/useSignupInscriptionScreen'
import SignupInscriptionActions from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionActions'
import SignupInscriptionScrollBody from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionScrollBody'

export default function SignupInscriptionMobileScreen() {
  const { formRef, isSubmitting, handleSkip, handleSuccess } = useSignupInscriptionScreen()

  return (
    <SignupMobileScrollShell>
      <YStack gap="$large" width="100%">
        <SignupInscriptionScrollBody formRef={formRef} onSuccess={handleSuccess} />
        <SignupInscriptionActions formRef={formRef} isSubmitting={isSubmitting} onSkip={handleSkip} />
      </YStack>
    </SignupMobileScrollShell>
  )
}
