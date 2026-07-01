import SignupMobileScrollShell from '@/features/signup/components/SignupMobileScrollShell'
import { useSignupInscriptionScreen } from '@/features/signup/hooks/useSignupInscriptionScreen'
import SignupInscriptionActions from '@/features/signup/pages/inscription/components/SignupInscriptionActions'
import SignupInscriptionScrollBody from '@/features/signup/pages/inscription/components/SignupInscriptionScrollBody'
import { useInscriptionContent } from '@/features/signup/pages/inscription/hooks/useInscriptionContent'

export default function InscriptionMobileScreen() {
  const { formRef, isSubmitting, handleSkip, handleSuccess } = useSignupInscriptionScreen()
  const content = useInscriptionContent()

  return (
    <SignupMobileScrollShell footer={<SignupInscriptionActions formRef={formRef} isSubmitting={isSubmitting} onSkip={handleSkip} />}>
      <SignupInscriptionScrollBody formRef={formRef} onSuccess={handleSuccess} content={content} />
    </SignupMobileScrollShell>
  )
}
