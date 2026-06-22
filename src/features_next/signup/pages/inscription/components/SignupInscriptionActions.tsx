import type { RefObject } from 'react'
import { YStack } from 'tamagui'
import { ArrowRight } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import type { SignupInscriptionFormHandle } from '@/features_next/signup/pages/inscription/components/SignupInscriptionForm'

type SignupInscriptionActionsProps = {
  formRef: RefObject<SignupInscriptionFormHandle | null>
  isSubmitting: boolean
  onSkip: () => void
}

export default function SignupInscriptionActions({ formRef, isSubmitting, onSkip }: SignupInscriptionActionsProps) {
  return (
    <YStack gap="$medium" width="100%">
      <VoxButton
        theme="blue"
        size="xl"
        onPress={() => formRef.current?.submit()}
        loading={isSubmitting}
        disabled={isSubmitting}
        full
        iconRight={ArrowRight}
      >
        Continuer
      </VoxButton>
      <VoxButton variant="soft" theme="gray" bg="white" size="xl" onPress={onSkip} full>
        Passer
      </VoxButton>
    </YStack>
  )
}
