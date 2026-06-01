import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'
import { ScrollView, YStack } from 'tamagui'
import { AlertTriangle } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { MessageCard } from '@/components/MessageCard/MessageCard'
import Title from '@/components/Title/Title'
import { useSignupActivate } from '@/features_next/signup/hooks/useSignupActivate'
import OpenMailboxButton from '@/features_next/signup/pages/SignupVerificationEmailPage/components/OpenMailboxButton'
import Otp3Input from '@/features_next/signup/pages/SignupVerificationEmailPage/components/Otp3Input'
import ResendCountdown from '@/features_next/signup/pages/SignupVerificationEmailPage/components/ResendCountdown'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

export default function SignupVerificationEmailPage() {
  const insets = useSafeAreaInsets()
  const email = useSignupSessionStore((s) => s.email)
  const firstName = useSignupSessionStore((s) => s.firstName)
  const inlineError = useSignupSessionStore((s) => s.inlineError)
  const { activateWithCode, isActivating } = useSignupActivate()

  if (!email) {
    return <Redirect href="/(signup)/inscription" />
  }

  return (
    <ScrollView flex={1} backgroundColor="$gray50">
      <YStack flex={1} padding="$medium" paddingTop={insets.top + 16} paddingBottom={insets.bottom + 16} gap="$medium" maxWidth={520} alignSelf="center">
        <Title>
          <Title.Highlight>Merci{firstName ? ` ${firstName}` : ''}</Title.Highlight>
          <Title.Text>😊</Title.Text>
          <Title.Break />
          <Title.Text>on y est presque</Title.Text>
        </Title>

        <Text.LG regular>
          Vérifions votre email <Text.LG semibold>afin de sécuriser votre compte.</Text.LG>
        </Text.LG>

        <YStack height={44} bg="$white1" borderRadius={22} justifyContent="center" padding="$medium">
          <Text.MD regular>{email}</Text.MD>
        </YStack>

        <YStack gap="$medium" alignItems="center">
          <Text.MD semibold textAlign="center">
            Saisissez le code reçu par email pour valider votre inscription.
          </Text.MD>
          <Otp3Input onComplete={(code) => activateWithCode(email, code)} disabled={isActivating} error={inlineError} />
          {inlineError ? (
            <MessageCard iconLeft={AlertTriangle} theme="orange">
              {inlineError}
            </MessageCard>
          ) : null}
          <OpenMailboxButton email={email} />
        </YStack>

        <ResendCountdown email={email} />
      </YStack>
    </ScrollView>
  )
}
