import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { SignInButton } from '@/components/Buttons/AuthButton'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { Link, usePathname, useNavigation } from 'expo-router'
import { XStack, YStack, Image, useMedia, getTokenValue } from 'tamagui'
import { LandPlot, ArrowLeft } from '@tamagui/lucide-icons'
import { DetailedAPIErrorPayload, ForbiddenError, UnauthorizedError } from '@/core/errors'
import { useSession } from '@/ctx/SessionProvider'
import { isWeb } from 'tamagui'
import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import VoxCard from '@/components/VoxCard/VoxCard'

const AdhButton = () => {
  const { isPending, open: handleClick } = useOpenExternalContent({ 
    slug: 'adhesion', 
    utm_source: "app", 
    utm_campaign: "event" 
  })
  const { signUp, isAuth } = useSession()

  return (
    <VoxButton 
      variant="outlined" 
      size="lg" 
      flex={1}
      theme="yellow" 
      onPress={isAuth ? handleClick() : () => signUp({ utm_campaign: "event" })} 
      loading={isPending}
    >
      Adhérer
    </VoxButton>
  )
}

const BackButton = () => {
  const { canGoBack } = useNavigation()
  return (
    <Link href={canGoBack() ? '../' : '/(militant)/evenements'} asChild={!isWeb}>
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16}>
        Événements
      </VoxButton>
    </Link>
  )
}

function DenyContent({ error }: { error: DetailedAPIErrorPayload }) {
  const path = usePathname()
  
  if (error instanceof ForbiddenError && error?.key === "event.agora.access_denied") {
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
            <VoxButton full size="lg" variant="outlined" iconLeft={LandPlot}>
              Mes instances
            </VoxButton>
          </Link>
        </XStack>
      </YStack>
    )
  }
  
  if (error instanceof ForbiddenError) {
    return (
      <YStack justifyContent="center" gap="$medium">
        <YStack gap="$medium" alignItems="center">
          <Text.MD multiline secondary textAlign="center" semibold>
            Cet événement est sur invitation.
          </Text.MD>
          <Text.MD multiline secondary textAlign="center" semibold>
            Impossible de le consulter ou de s'y inscrire sans y être invité.
          </Text.MD>
        </YStack>
      </YStack>
    )
  }
  
  if (error instanceof UnauthorizedError) {
    return (
      <YStack justifyContent="center" gap="$medium">
        <YStack gap="$medium" alignItems="center">
          <Text.MD multiline secondary textAlign="center" semibold>
            Cet événement est réservé aux militants. Rejoignez-nous pour y participer.
          </Text.MD>
        </YStack>
        <XStack gap="$small">
          <SignInButton redirectUri={path} variant="text" size="lg" flex={1} />
          <AdhButton />
        </XStack>
      </YStack>
    )
  }
  
  return null
}

// Mobile Layout
const MobileDeny = ({ error }: { error: DetailedAPIErrorPayload }) => {
  const insets = useSafeAreaInsets()
  
  return (
    <>
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#ECF1F5">
        <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
      </YStack>
      <YStack 
        padding="$xlarge" 
        pb={getTokenValue('$xlarge') + insets.bottom} 
        bg="white" 
        justifyContent="center" 
        alignItems="center"
      >
        <DenyContent error={error} />
      </YStack>
    </>
  )
}

// Desktop Layout
const DesktopDeny = ({ error }: { error: DetailedAPIErrorPayload }) => {
  return (
    <Layout.Main maxWidth={920}>
      <LayoutScrollView>
        <XStack alignItems="flex-start" alignSelf="flex-start" pb="$medium">
          <BackButton />
        </XStack>
        <XStack gap="$medium" alignItems="flex-start">
          <YStack flex={1} height={500}>
            <VoxCard overflow="hidden" height="100%">
              <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#ECF1F5">
                <Image src={require('@/assets/illustrations/VisuCadnas.png')} />
              </YStack>
            </VoxCard>
          </YStack>
          <YStack width={320}>
            <VoxCard>
              <VoxCard.Content>
                <DenyContent error={error} />
              </VoxCard.Content>
            </VoxCard>
          </YStack>
        </XStack>
      </LayoutScrollView>
    </Layout.Main>
  )
}

export function EventDenyScreen({ error }: { error: DetailedAPIErrorPayload }) {
  const media = useMedia()
  return media.sm ? <MobileDeny error={error} /> : <DesktopDeny error={error} />
}

