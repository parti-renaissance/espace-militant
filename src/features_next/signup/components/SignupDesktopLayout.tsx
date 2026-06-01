import type { ReactNode } from 'react'
import { Image, ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { isWeb, ScrollView, useMedia, XStack, YStack } from 'tamagui'
import { Newspaper, UsersRound, Zap } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'
import VoxCard from '@/components/VoxCard/VoxCard'

import bgBlur from '../assets/bg-blur.jpg'
import illuInscription from '../assets/illu-inscription.jpg'

/** $gray50 — fondu transparent → opaque pour le pied de page desktop */
export const SIGNUP_DESKTOP_FOOTER_GRADIENT = ['rgba(250, 247, 244, 0)', 'rgba(250, 247, 244, 0.92)', '#FAF7F4'] as const

export const SIGNUP_DESKTOP_FORM_MAX_WIDTH = 422

export function SignupEngagementCard() {
  return (
    <YStack bg="$white0" padding="$medium" borderRadius="$medium" gap="$medium">
      <Title size="h2">
        <Title.Text>Comment s'engager :</Title.Text>
      </Title>
      <YStack gap="$small">
        <XStack flexShrink={1} gap={12}>
          <UsersRound size={16} color="$purple500" />
          <Text.SM>Rejoindre une communauté qui s&apos;engage pour le pays.</Text.SM>
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
  )
}

export function SignupDesktopIllustrationColumn() {
  return (
    <YStack width="50%" minWidth={300} minHeight={0} height="100%" position="relative" overflow="hidden">
      <Image source={illuInscription} style={{ width: '100%', height: '100%' }} contentFit="cover" cachePolicy="memory-disk" />
      <YStack position="absolute" bottom={0} left={0} right={0} padding="$large" zIndex={1}>
        <SignupEngagementCard />
      </YStack>
    </YStack>
  )
}

type SignupDesktopFormColumnProps = {
  scrollContent: ReactNode
  footer?: ReactNode
  paddingRight: number
  paddingBottom: number
  footerSpacerHeight?: number
  /** Pied fixe avec dégradé (inscription). Sinon tout le contenu défile. */
  stickyFooter?: boolean
}

function SignupDesktopFormColumnContainer({ children }: { children: ReactNode }) {
  return (
    <YStack flex={1} width="100%" height="100%" minWidth={0} minHeight={0} backgroundColor="$gray50">
      {children}
    </YStack>
  )
}

const formScrollViewProps = {
  flex: 1 as const,
  width: '100%' as const,
  height: '100%' as const,
  minHeight: 0 as const,
  showsVerticalScrollIndicator: true,
  persistentScrollbar: isWeb,
  backgroundColor: '$gray50' as const,
  ...(isWeb ? { style: { flex: 1, minHeight: 0, overflowY: 'scroll' as const } } : undefined),
}

function SignupDesktopFormContent({
  children,
  paddingRight,
  paddingBottom,
  gap = false,
  variant = 'body',
}: {
  children: ReactNode
  paddingRight: number
  paddingBottom?: number
  gap?: boolean
  /** `footer` : pas de padding haut (pied fixe inscription). */
  variant?: 'body' | 'footer'
}) {
  const media = useMedia()
  const paddingTop = variant === 'footer' ? '$none' : media.gtSm ? '$xxxlarge' : '$xlarge'

  return (
    <YStack
      width="100%"
      maxWidth={SIGNUP_DESKTOP_FORM_MAX_WIDTH}
      alignSelf="center"
      padding="$xlarge"
      paddingTop={paddingTop}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
      gap={gap ? '$medium' : undefined}
    >
      {children}
    </YStack>
  )
}

function getScrollContentContainerStyle(centerContent: boolean, paddingBottom: number) {
  return {
    alignItems: 'center' as const,
    justifyContent: (centerContent ? 'center' : 'flex-start') as 'center' | 'flex-start',
    paddingBottom,
  }
}

export function SignupDesktopFormColumn({
  scrollContent,
  footer,
  paddingRight,
  paddingBottom,
  footerSpacerHeight = 150,
  stickyFooter = true,
}: SignupDesktopFormColumnProps) {
  if (!stickyFooter) {
    return (
      <SignupDesktopFormColumnContainer>
        <ScrollView {...formScrollViewProps} contentContainerStyle={getScrollContentContainerStyle(true, paddingBottom + 16)}>
          <SignupDesktopFormContent paddingRight={paddingRight} paddingBottom={paddingBottom} gap>
            {scrollContent}
            {footer}
          </SignupDesktopFormContent>
        </ScrollView>
      </SignupDesktopFormColumnContainer>
    )
  }

  return (
    <SignupDesktopFormColumnContainer>
      <YStack flex={1} width="100%" height="100%" minHeight={0} position="relative">
        <ScrollView {...formScrollViewProps} contentContainerStyle={getScrollContentContainerStyle(false, 16)}>
          <SignupDesktopFormContent paddingRight={paddingRight}>
            {scrollContent}
            <YStack height={footerSpacerHeight} />
          </SignupDesktopFormContent>
        </ScrollView>

        {footer ? (
          <LinearGradient
            colors={[...SIGNUP_DESKTOP_FOOTER_GRADIENT]}
            locations={[0, 0.4, 1]}
            start={[0, 0]}
            end={[0, 1]}
            style={{ width: '100%', flexShrink: 0, position: 'absolute', bottom: 0, left: 0, right: 0 }}
          >
            <SignupDesktopFormContent variant="footer" paddingRight={paddingRight} paddingBottom={paddingBottom}>
              {footer}
            </SignupDesktopFormContent>
          </LinearGradient>
        ) : null}
      </YStack>
    </SignupDesktopFormColumnContainer>
  )
}

type SignupDesktopPageShellProps = {
  children: ReactNode
  paddingLeft: number
  maxWidth?: number
  maxHeight?: number
}

export function SignupDesktopPageShell({ children, paddingLeft, maxWidth = 1136, maxHeight }: SignupDesktopPageShellProps) {
  const viewportMinHeight = isWeb ? '100dvh' : undefined
  const desktopCardMaxHeight = isWeb ? 'calc(100dvh - 48px)' : '100%'

  return (
    <YStack
      flex={1}
      width="100%"
      height={viewportMinHeight}
      maxHeight={viewportMinHeight}
      alignItems="center"
      position="relative"
      overflow="hidden"
      paddingVertical="$large"
      paddingHorizontal={paddingLeft}
    >
      <YStack position="absolute" top={0} bottom={0} left={0} right={0} zIndex={0}>
        <ImageBackground source={bgBlur} style={{ width: '100%', height: '100%' }} contentFit="cover" cachePolicy="memory-disk" />
      </YStack>

      <YStack flex={1} width="100%" maxWidth={maxWidth} minHeight={0} alignItems="center" justifyContent="center" maxHeight={desktopCardMaxHeight} zIndex={1}>
        <VoxCard
          flex={1}
          width="100%"
          height="100%"
          maxHeight={maxHeight ?? '100%'}
          borderRadius="$medium"
          borderWidth={0}
          overflow="hidden"
          shadowColor="transparent"
        >
          <XStack flex={1} height="100%" minHeight={0} maxHeight="100%" alignItems="stretch">
            {children}
          </XStack>
        </VoxCard>
      </YStack>
    </YStack>
  )
}
