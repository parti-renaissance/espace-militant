import type { RefObject } from 'react'
import { YStack } from 'tamagui'

import { SignupEngagementCard } from '@/features_next/signup/components/SignupDesktopLayout'
import SignupInscriptionForm from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionForm'
import type { SignupInscriptionFormHandle } from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionForm'
import SignupInscriptionHeader from '@/features_next/signup/pages/SignupInscriptionScreen/components/SignupInscriptionHeader'

type SignupInscriptionScrollBodyProps = {
  formRef: RefObject<SignupInscriptionFormHandle | null>
  onSuccess: () => void
  showEngagementCard?: boolean
}

export default function SignupInscriptionScrollBody({ formRef, onSuccess, showEngagementCard = true }: SignupInscriptionScrollBodyProps) {
  return (
    <YStack gap="$large" width="100%">
      <SignupInscriptionHeader />
      {showEngagementCard ? <SignupEngagementCard /> : null}
      <SignupInscriptionForm ref={formRef} onSuccess={onSuccess} />
    </YStack>
  )
}
