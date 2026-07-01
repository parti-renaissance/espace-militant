import { useEffect, useState } from 'react'
import { XStack, YStack } from 'tamagui'
import { Mail } from '@tamagui/lucide-icons'
import { z } from 'zod'

import Input from '@/components/base/Input/Input'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { ContentBackButton } from '@/components/ContentBackButton'
import Title from '@/components/Title/Title'
import Otp3Input from '@/features/signup/pages/verification-email/components/Otp3Input'
import { AuthRoutes } from '@/features/signup/utils/authNavigation'
import { getSignupErrorMessage } from '@/features/signup/utils/errors'

import { errorMessages } from '@/utils/errorMessages'

const MailCircleIcon = () => (
  <YStack width={32} height={32} borderRadius={16} backgroundColor="#BCEFC3" alignItems="center" justifyContent="center">
    <Mail size={16} color="$black2" />
  </YStack>
)

type SignupVerificationEmailScrollBodyProps = {
  email: string
  firstName: string
  inlineError: string | null
  isActivating: boolean
  isChangingEmail: boolean
  requiresManualLogin: boolean
  onActivate: (code: string) => void
  onStartEditingCode: () => void
  onChangeEmail: (email: string) => Promise<void>
  onSignIn: () => void
}

export default function SignupVerificationEmailScrollBody({
  email,
  firstName,
  inlineError,
  isActivating,
  isChangingEmail,
  requiresManualLogin,
  onActivate,
  onStartEditingCode,
  onChangeEmail,
  onSignIn,
}: SignupVerificationEmailScrollBodyProps) {
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [draftEmail, setDraftEmail] = useState(email)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showEmailSentConfirmation, setShowEmailSentConfirmation] = useState(false)

  const startEditingEmail = () => {
    setDraftEmail(email)
    setEmailError(null)
    setShowEmailSentConfirmation(false)
    setIsEditingEmail(true)
  }

  useEffect(() => {
    if (!showEmailSentConfirmation) return
    const timeout = setTimeout(() => setShowEmailSentConfirmation(false), 5000)
    return () => clearTimeout(timeout)
  }, [showEmailSentConfirmation])

  const saveEmail = async () => {
    const trimmed = draftEmail.trim()
    if (!z.string().email().safeParse(trimmed).success) {
      setEmailError(errorMessages.email)
      return
    }
    setEmailError(null)
    try {
      await onChangeEmail(trimmed)
      setIsEditingEmail(false)
      setShowEmailSentConfirmation(true)
    } catch (error) {
      setEmailError(getSignupErrorMessage(error))
    }
  }

  return (
    <YStack gap="$medium" width="100%">
      <XStack ml={-12} mb={-8}>
        <ContentBackButton fallbackPath={AuthRoutes.INSCRIPTION} showOnMobile />
      </XStack>

      <Title>
        <Title.Highlight>Merci{firstName ? ` ${firstName}` : ''}</Title.Highlight>
        <Title.Text>😊</Title.Text>
        <Title.Break />
        <Title.Text>on y est presque</Title.Text>
      </Title>

      <Text.LG regular>
        Vérifions votre email <Text.LG semibold>afin de sécuriser votre compte.</Text.LG>
      </Text.LG>

      {isEditingEmail ? (
        <Input
          placeholder="Email"
          value={draftEmail}
          onChangeText={setDraftEmail}
          error={emailError ?? undefined}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          size="sm"
          loading={isChangingEmail}
          iconRight={
            <VoxButton variant="text" size="sm" theme="blue" onPress={saveEmail} disabled={isChangingEmail}>
              Enregistrer
            </VoxButton>
          }
        />
      ) : (
        <YStack gap="$small" width="100%">
          <XStack height={44} bg="$white1" borderRadius={22} alignItems="center" justifyContent="space-between" paddingHorizontal="$medium">
            <Text.MD regular>{email}</Text.MD>
            {requiresManualLogin ? null : (
              <VoxButton variant="text" size="sm" theme="blue" alignSelf="center" onPress={startEditingEmail}>
                Modifier
              </VoxButton>
            )}
          </XStack>
          {showEmailSentConfirmation ? (
            <XStack bg="$green100" borderRadius={45} padding="$medium" gap="$medium" alignItems="center" width="100%">
              <MailCircleIcon />
              <Text.MD multiline semibold color="$green900" flexShrink={1}>
                Un nouvel email de confirmation vient de vous être envoyé.
              </Text.MD>
            </XStack>
          ) : null}
        </YStack>
      )}

      <YStack gap="$medium" alignItems="center" width="100%">
        {requiresManualLogin ? (
          <>
            {inlineError ? (
              <Text.MD textAlign="center" color="$red600">
                {inlineError}
              </Text.MD>
            ) : null}
            <VoxButton theme="blue" alignSelf="center" onPress={onSignIn}>
              Me connecter
            </VoxButton>
          </>
        ) : (
          <>
            <Text.MD semibold textAlign="center">
              Saisissez le code reçu par email pour valider votre inscription.
            </Text.MD>
            <Otp3Input onComplete={onActivate} disabled={isActivating} hasError={Boolean(inlineError)} onStartEditing={onStartEditingCode} />
            {inlineError ? <Text.MD color="$red600">{inlineError}</Text.MD> : null}
          </>
        )}
      </YStack>
    </YStack>
  )
}
