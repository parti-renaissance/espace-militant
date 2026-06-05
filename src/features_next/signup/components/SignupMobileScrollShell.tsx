import type { PropsWithChildren, ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { isWeb, ScrollView, YStack } from 'tamagui'

import { SIGNUP_DESKTOP_FOOTER_GRADIENT } from '@/features_next/signup/components/SignupDesktopLayout'

type SignupMobileScrollShellProps = PropsWithChildren<{
  gap?: '$medium' | '$large'
  footer?: ReactNode
  footerSpacerHeight?: number
}>

export default function SignupMobileScrollShell({ children, footer, gap = '$large', footerSpacerHeight = 160 }: SignupMobileScrollShellProps) {
  const insets = useSafeAreaInsets()
  const viewportMinHeight = isWeb ? '100dvh' : undefined
  const paddingBottom = Math.max(insets.bottom, 16)

  const scrollContent = (
    <YStack
      flex={footer ? 1 : undefined}
      flexGrow={footer ? 1 : undefined}
      maxHeight={viewportMinHeight}
      px="$medium"
      paddingTop={insets.top + 24}
      paddingBottom={footer ? undefined : paddingBottom}
      gap={gap}
      width="100%"
      maxWidth={520}
      alignSelf="center"
    >
      {children}
      {footer ? <YStack height={footerSpacerHeight} /> : null}
    </YStack>
  )

  if (!footer) {
    return (
      <ScrollView flex={1} backgroundColor="$gray50" height={viewportMinHeight} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {scrollContent}
      </ScrollView>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$gray50" height={viewportMinHeight} maxHeight={viewportMinHeight} position="relative">
      <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {scrollContent}
      </ScrollView>

      <LinearGradient
        colors={[...SIGNUP_DESKTOP_FOOTER_GRADIENT]}
        locations={[0, 0.4, 1]}
        start={[0, 0]}
        end={[0, 1]}
        style={{ width: '100%', flexShrink: 0, position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <YStack px="$medium" paddingBottom={paddingBottom} width="100%" maxWidth={520} alignSelf="center">
          {footer}
        </YStack>
      </LinearGradient>
    </YStack>
  )
}
