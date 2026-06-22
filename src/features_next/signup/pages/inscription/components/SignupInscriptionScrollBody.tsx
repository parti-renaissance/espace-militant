import type { RefObject } from 'react'
import { YStack } from 'tamagui'

import SignupInscriptionForm from '@/features_next/signup/pages/inscription/components/SignupInscriptionForm'
import type { SignupInscriptionFormHandle } from '@/features_next/signup/pages/inscription/components/SignupInscriptionForm'
import SignupInscriptionHeader from '@/features_next/signup/pages/inscription/components/SignupInscriptionHeader'
import type { InscriptionConfigItem } from '@/features_next/signup/pages/inscription/config'

type SignupInscriptionScrollBodyProps = {
  formRef: RefObject<SignupInscriptionFormHandle | null>
  onSuccess: () => void
  content: InscriptionConfigItem
  showEngagementCard?: boolean
}

export default function SignupInscriptionScrollBody({ formRef, onSuccess, content, showEngagementCard = true }: SignupInscriptionScrollBodyProps) {
  const EngagementComponent = content.EngagementComponent

  return (
    <YStack gap="$large" width="100%">
      <SignupInscriptionHeader TitleComponent={content.TitleComponent} SubtitleComponent={content.SubtitleComponent} />
      {showEngagementCard && EngagementComponent ? <EngagementComponent /> : null}
      <SignupInscriptionForm ref={formRef} onSuccess={onSuccess} />
    </YStack>
  )
}
