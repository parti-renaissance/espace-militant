import { YStack } from 'tamagui'

import OpenMailboxButton from '@/features/signup/pages/verification-email/components/OpenMailboxButton'
import ResendCountdown from '@/features/signup/pages/verification-email/components/ResendCountdown'

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
