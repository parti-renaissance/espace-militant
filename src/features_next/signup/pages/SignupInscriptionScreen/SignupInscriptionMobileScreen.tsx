import SignupMobileScrollShell from '@/features_next/signup/components/SignupMobileScrollShell'
import { useSignupInscriptionScreen } from '@/features_next/signup/hooks/useSignupInscriptionScreen'
import SignupInscriptionActions from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionActions'
import SignupInscriptionScrollBody from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionScrollBody'

export default function SignupInscriptionMobileScreen() {
  const { formRef, isSubmitting, handleSkip, handleSuccess } = useSignupInscriptionScreen()

  return (
    <SignupMobileScrollShell
      footer={<SignupInscriptionActions formRef={formRef} isSubmitting={isSubmitting} onSkip={handleSkip} />}
    >
      <SignupInscriptionScrollBody formRef={formRef} onSuccess={handleSuccess} />
    </SignupMobileScrollShell>
  )
}
