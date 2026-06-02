import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'
import Otp3Input from '@/features_next/signup/pages/SignupVerificationEmailScreen/components/Otp3Input'

type SignupVerificationEmailScrollBodyProps = {
  email: string
  firstName: string
  inlineError: string | null
  isActivating: boolean
  onActivate: (code: string) => void
  onStartEditingCode: () => void
}

export default function SignupVerificationEmailScrollBody({
  email,
  firstName,
  inlineError,
  isActivating,
  onActivate,
  onStartEditingCode,
}: SignupVerificationEmailScrollBodyProps) {
  return (
    <YStack gap="$medium" width="100%">
      <Title>
        <Title.Highlight>Merci{firstName ? ` ${firstName}` : ''}</Title.Highlight>
        <Title.Text>😊</Title.Text>
        <Title.Break />
        <Title.Text>on y est presque</Title.Text>
      </Title>

      <Text.LG regular>
        Vérifions votre email <Text.LG semibold>afin de sécuriser votre compte.</Text.LG>
      </Text.LG>

      <YStack height={44} bg="$white1" borderRadius={22} justifyContent="center" paddingHorizontal="$medium">
        <Text.MD regular>{email}</Text.MD>
      </YStack>

      <YStack gap="$medium" alignItems="center" width="100%">
        <Text.MD semibold textAlign="center">
          Saisissez le code reçu par email pour valider votre inscription.
        </Text.MD>
        <Otp3Input
          onComplete={onActivate}
          disabled={isActivating}
          hasError={Boolean(inlineError)}
          onStartEditing={onStartEditingCode}
        />
        {inlineError ? <Text.MD color="$red600">{inlineError}</Text.MD> : null}
      </YStack>
    </YStack>
  )
}
