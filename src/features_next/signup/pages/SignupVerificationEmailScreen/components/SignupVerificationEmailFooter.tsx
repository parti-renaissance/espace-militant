import { YStack } from 'tamagui'

import OpenMailboxButton from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/OpenMailboxButton'
import ResendCountdown from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/ResendCountdown'

type SignupVerificationEmailFooterProps = {
  email: string
}

export default function SignupVerificationEmailFooter({ email }: SignupVerificationEmailFooterProps) {
  return (
    <YStack gap="$medium" width="100%" alignItems="center">
      <OpenMailboxButton email={email} />
      <ResendCountdown email={email} />
    </YStack>
  )
}
