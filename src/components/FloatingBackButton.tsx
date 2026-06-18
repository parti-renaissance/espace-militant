import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Href, useRouter } from 'expo-router'
import { YStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

type FloatingBackButtonProps = {
  fallbackPath?: Href
  withSafeArea?: boolean
}

export const FloatingBackButton = ({ fallbackPath = '/' as Href, withSafeArea = true }: FloatingBackButtonProps) => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace(fallbackPath)
    }
  }

  return (
    <YStack position="absolute" top={(withSafeArea ? insets.top : 0) + 16} left={16} zIndex={100}>
      <VoxButton variant="contained" theme="gray" iconLeft={ArrowLeft} size="md" shrink onPress={handleBack} />
    </YStack>
  )
}
