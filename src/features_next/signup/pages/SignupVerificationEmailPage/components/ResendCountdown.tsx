import { useEffect, useState } from 'react'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { getResendSecondsLeft, isResendCooldownActive, useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'
import { getSignupErrorMessage } from '@/features_next/signup/utils/errors'

import { useResendSignupCode } from '@/services/signup/hook'

type ResendCountdownProps = {
  email: string
}

export default function ResendCountdown({ email }: ResendCountdownProps) {
  const resendAvailableAt = useSignupSessionStore((s) => s.resendAvailableAt)
  const startResendCooldown = useSignupSessionStore((s) => s.startResendCooldown)
  const setInlineError = useSignupSessionStore((s) => s.setInlineError)
  const { mutateAsync: resend, isPending } = useResendSignupCode()
  const [secondsLeft, setSecondsLeft] = useState(() => getResendSecondsLeft(resendAvailableAt))

  useEffect(() => {
    setSecondsLeft(getResendSecondsLeft(resendAvailableAt))
    if (!isResendCooldownActive(resendAvailableAt)) return

    const interval = setInterval(() => {
      setSecondsLeft(getResendSecondsLeft(resendAvailableAt))
    }, 1000)

    return () => clearInterval(interval)
  }, [resendAvailableAt])

  const canResend = !isResendCooldownActive(resendAvailableAt)

  const handleResend = async () => {
    if (!canResend || !email) return
    setInlineError(null)
    try {
      await resend({ email })
      startResendCooldown()
      setSecondsLeft(getResendSecondsLeft(useSignupSessionStore.getState().resendAvailableAt))
    } catch (error) {
      setInlineError(getSignupErrorMessage(error))
    }
  }

  if (!canResend) {
    return (
      <YStack alignItems="center" gap="$small">
        <Text.MD secondary textAlign="center">
          Vous n’avez rien reçu ?
        </Text.MD>
        <Text.MD secondary textAlign="center">
          Renvoyer le code dans ({secondsLeft} s)
        </Text.MD>
      </YStack>
    )
  }

  return (
    <YStack justifyContent="center" alignItems="center" width="100%">
      <YStack>
        <VoxButton variant="outlined" theme="blue" size="sm" onPress={handleResend} loading={isPending} disabled={isPending}>
          Renvoyer le code
        </VoxButton>
      </YStack>
    </YStack>
  )
}
