import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { usePathname } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'

import Layout from '@/components/AppStructure/Layout/Layout'
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView'
import Text from '@/components/base/Text'
import { SignInButton, SignUpButton } from '@/components/Buttons/AuthButton'
import { ContentBackButton } from '@/components/ContentBackButton'
import { FloatingBackButton } from '@/components/FloatingBackButton'
import VoxCard from '@/components/VoxCard/VoxCard'

import visuCadnasImg from '@/assets/illustrations/VisuCadnas.png'

import { ActionDetailMapFrame } from './ActionDetailMap'

const LOCK_IMAGE_RATIO = 88 / 153

function ActionLockBlock() {
  const media = useMedia()
  const insets = useSafeAreaInsets()
  const baseHeight = media.sm ? 250 : 300
  const topInset = media.sm ? insets.top : 0
  const lockHeight = media.sm ? 210 : 260
  const lockWidth = Math.round(lockHeight * LOCK_IMAGE_RATIO)

  return (
    <ActionDetailMapFrame baseHeight={baseHeight} topInset={topInset}>
      <YStack flex={1} width="100%" overflow="hidden" justifyContent="center" alignItems="center" backgroundColor="#ECF1F5">
        <Image source={visuCadnasImg} contentFit="contain" style={{ height: lockHeight, width: lockWidth }} />
      </YStack>
    </ActionDetailMapFrame>
  )
}

function LockContent() {
  const path = usePathname()

  return (
    <YStack gap="$medium" justifyContent="center">
      <Text.MD multiline secondary textAlign="center" semibold>
        Connectez-vous pour voir cette action.
      </Text.MD>
      <YStack gap="$small" width="100%">
        <SignInButton redirectUri={path} variant="contained" size="xl" full />
        <SignUpButton variant="outlined" size="xl" full />
      </YStack>
    </YStack>
  )
}

const MobileLock = () => (
  <>
    <Layout.Main maxWidth={892}>
      <LayoutScrollView padding={false}>
        <YStack paddingBottom={100}>
          <VoxCard overflow="visible" borderWidth={0}>
            <ActionLockBlock />
            <YStack px="$medium" py="$large">
              <LockContent />
            </YStack>
          </VoxCard>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
    <FloatingBackButton />
  </>
)

const DesktopLock = () => (
  <Layout.Main maxWidth={892}>
    <LayoutScrollView>
      <ContentBackButton fallbackPath="/" />
      <YStack gap="$medium">
        <VoxCard>
          <XStack alignItems="flex-start" py="$medium">
            <YStack flex={1} flexShrink={1} minWidth={0} px="$medium" borderRightColor="$textOutline32" borderRightWidth={1}>
              <ActionLockBlock />
            </YStack>
            <YStack width={320} flexShrink={0} px="$medium" justifyContent="center">
              <LockContent />
            </YStack>
          </XStack>
        </VoxCard>
      </YStack>
    </LayoutScrollView>
  </Layout.Main>
)

export function ActionDetailsScreenLock() {
  const media = useMedia()
  return media.sm ? <MobileLock /> : <DesktopLock />
}
