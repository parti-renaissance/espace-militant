import type { PropsWithChildren } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isWeb, ScrollView, YStack } from 'tamagui'

type SignupMobileScrollShellProps = PropsWithChildren<{
  gap?: '$medium' | '$large'
}>

export default function SignupMobileScrollShell({ children, gap = '$large' }: SignupMobileScrollShellProps) {
  const insets = useSafeAreaInsets()
  const viewportMinHeight = isWeb ? '100dvh' : undefined

  return (
    <ScrollView
      flex={1}
      backgroundColor="$gray50"
      height={viewportMinHeight}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack
        flex={1}
        maxHeight={viewportMinHeight}
        px="$medium"
        paddingTop={insets.top + 24}
        paddingBottom={insets.bottom + 24}
        gap={gap}
        width="100%"
        maxWidth={520}
        alignSelf="center"
      >
        {children}
      </YStack>
    </ScrollView>
  )
}
