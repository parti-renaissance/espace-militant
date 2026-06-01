import { useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Href, router } from 'expo-router'
import { ScrollView, XStack, YStack } from 'tamagui'
import { ArrowRight, Newspaper, UsersRound, Zap } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import Title from '@/components/Title/Title'
import SignupInscriptionForm, { type SignupInscriptionFormHandle } from '@/features_next/signup/pages/SignupInscriptionPage/components/SignupInscriptionForm'
import { useSignupSessionStore } from '@/features_next/signup/store/signup-session-store'

import { useUserStore } from '@/store/user-store'

export default function SignupInscriptionPage() {
  const insets = useSafeAreaInsets()
  const formRef = useRef<SignupInscriptionFormHandle>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setSignupTunnelSkipped = useUserStore((s) => s.setSignupTunnelSkipped)
  const resetSignupSession = useSignupSessionStore((s) => s.reset)

  const handleSkip = () => {
    setSignupTunnelSkipped()
    resetSignupSession()
    router.replace('/evenements' as Href)
  }

  const handleSuccess = () => {
    router.push('/(signup)/verification-email')
  }

  return (
    <ScrollView flex={1} backgroundColor="$gray50">
      <YStack flex={1} padding="$medium" paddingTop={insets.top + 16} paddingBottom={insets.bottom + 16} gap="$large" maxWidth={520} alignSelf="center">
        <YStack gap="$medium">
          <Title>
            <Title.Text>On fait</Title.Text>
            <Title.Highlight>connaissance</Title.Highlight>
            <Title.Text>?</Title.Text>
          </Title>
          <Text.LG regular>
            Quelques infos pour <Text.LG semibold>personnaliser votre app.</Text.LG>
          </Text.LG>
        </YStack>

        <YStack bg="$white0" padding="$medium" borderRadius="$medium" gap="$medium">
          <Title size="h2">
            <Title.Text>Comment s'engager :</Title.Text>
          </Title>
          <YStack gap="$small">
            <XStack flexShrink={1} gap={12}>
              <UsersRound size={16} color="$purple500" />
              <Text.SM>Rejoindre une communauté qui s‘engagent pour le pays.</Text.SM>
            </XStack>
            <XStack flexShrink={1} gap={12}>
              <Zap size={16} color="$purple500" />
              <Text.SM>Mener des actions concrètes pour changer les choses près de chez vous.</Text.SM>
            </XStack>
            <XStack flexShrink={1} gap={12}>
              <Newspaper size={16} color="$purple500" />
              <Text.SM>Partager notre actualité et notre projet.</Text.SM>
            </XStack>
          </YStack>
        </YStack>

        <YStack gap="$medium">
          <SignupInscriptionForm ref={formRef} onSuccess={handleSuccess} onLoadingChange={setIsSubmitting} />
          <YStack gap="$medium">
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
            <VoxButton variant="soft" theme="gray" bg="white" size="xl" onPress={handleSkip} full>
              Passer
            </VoxButton>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
