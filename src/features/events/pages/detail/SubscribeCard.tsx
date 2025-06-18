import React, { ComponentProps } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { SignInButton } from '@/components/Buttons/AuthButton'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { Link, usePathname } from 'expo-router'
import { XStack, YStack } from 'tamagui'
import { LandPlot } from '@tamagui/lucide-icons'
import { DetailedAPIErrorPayload } from '@/core/errors'
import { useSession } from '@/ctx/SessionProvider'

const AdhButton = (props: { bgColor?: string; children?: string; variant?: ComponentProps<typeof VoxButton>['variant'] }) => {
  const { isPending, open: handleClick } = useOpenExternalContent({ slug: 'adhesion', utm_source: "app", utm_campaign: "event" })
  const { signUp, isAuth } = useSession()

  return (
    <VoxButton variant={props.variant} size="lg" width="100%" theme="yellow" onPress={isAuth ? handleClick() : () => signUp({utm_campaign: "event"})} loading={isPending}>
      {props.children ?? 'Adhérer'}
    </VoxButton>
  )
}

export function LockPublicAuthAdhCard() {
  const path = usePathname()
  return (
    <YStack justifyContent="center" gap="$medium">
      <YStack gap="$medium" alignItems="center">
        <Text.MD multiline secondary textAlign="center" semibold>
          Cet événement est réservé aux militants. Rejoignez-nous pour y participer.
        </Text.MD>
      </YStack>
      <XStack gap="$small">
        <SignInButton redirectUri={path} variant="text" size="lg" flex={1} />
        <XStack flex={1}>
          <AdhButton variant="outlined" />
        </XStack>
      </XStack>
    </YStack>
  )
}

export function LockUnauthorizedContent() {
  const path = usePathname()
  return (
    <YStack justifyContent="center" gap="$medium">
      <YStack gap="$medium" alignItems="center">
        <Text.MD multiline secondary textAlign="center" semibold>
          Cet événement est réservé aux militants. Rejoignez-nous pour y participer.
        </Text.MD>
      </YStack>
      <XStack gap="$small">
        <SignInButton redirectUri={path} variant="text" size="lg" flex={1} />
        <XStack flex={1}>
          <AdhButton variant="outlined" />
        </XStack>
      </XStack>
    </YStack>
  )
}

export function LockForbiddenContent({ error }: {error: DetailedAPIErrorPayload}) {
  const path = usePathname()
  if (error?.key == "event.agora.access_denied") {
    return (
      <YStack justifyContent="center" gap="$medium">
        <YStack gap="$medium" alignItems="center">
          <Text.MD multiline secondary textAlign="center" semibold>
            {error?.detail}
          </Text.MD>
          <Text.MD multiline secondary textAlign="center" semibold>
            Rejoignez-là depuis Profil {'>'} Mes instances pour y participer
          </Text.MD>
        </YStack>
        <XStack gap="$small">
          <Link asChild href="/profil/mes-instances">
            <VoxButton full size="lg" variant="outlined" iconLeft={LandPlot}>Mes instances</VoxButton>
          </Link>
        </XStack>
      </YStack>
    )
  }
  return (
    <YStack justifyContent="center" gap="$medium">
      <YStack gap="$medium" alignItems="center">
        <Text.MD multiline secondary textAlign="center" semibold>
          Cet événement est sur invitation.
        </Text.MD>
        <Text.MD multiline secondary textAlign="center" semibold>
          Impossible de le consulter ou de s’y inscrire sans y être invité.
        </Text.MD>
      </YStack>
    </YStack>
  )
}