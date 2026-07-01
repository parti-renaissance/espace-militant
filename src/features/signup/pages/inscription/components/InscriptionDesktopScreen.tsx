import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  SignupDesktopFormColumn,
  SignupDesktopIllustrationColumn,
  SignupDesktopPageShell,
} from '@/features/signup/components/SignupDesktopLayout'
import { useSignupInscriptionScreen } from '@/features/signup/hooks/useSignupInscriptionScreen'
import { useInscriptionContent } from '@/features/signup/pages/inscription/hooks/useInscriptionContent'
import SignupInscriptionActions from '@/features/signup/pages/inscription/components/SignupInscriptionActions'
import SignupInscriptionScrollBody from '@/features/signup/pages/inscription/components/SignupInscriptionScrollBody'

export default function InscriptionDesktopScreen() {
  const insets = useSafeAreaInsets()
  const { formRef, isSubmitting, handleSkip, handleSuccess } = useSignupInscriptionScreen()
  const content = useInscriptionContent()
  const EngagementComponent = content.EngagementComponent
  const DesktopIllustrationComponent = content.DesktopIllustrationComponent

  return (
    <SignupDesktopPageShell paddingLeft={insets.left + 16}>
      <SignupDesktopIllustrationColumn
        engagementCard={EngagementComponent ? <EngagementComponent /> : null}
        illustration={DesktopIllustrationComponent ? <DesktopIllustrationComponent /> : undefined}
      />
      <SignupDesktopFormColumn
        paddingRight={insets.right + 32}
        paddingBottom={insets.bottom + 16}
        scrollContent={
          <SignupInscriptionScrollBody formRef={formRef} onSuccess={handleSuccess} content={content} showEngagementCard={false} />
        }
        footer={<SignupInscriptionActions formRef={formRef} isSubmitting={isSubmitting} onSkip={handleSkip} />}
      />
    </SignupDesktopPageShell>
  )
}
