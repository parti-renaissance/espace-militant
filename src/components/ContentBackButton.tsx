import React from 'react'
import { Href, useRouter } from 'expo-router'
import { XStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

interface ContentBackButtonProps {
  fallbackPath?: Href
  label?: string
}

export const ContentBackButton = ({ fallbackPath = '/' as Href, label = 'Retour' }: ContentBackButtonProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }
    router.replace(fallbackPath)
  }

  return (
    <XStack alignItems="flex-start" alignSelf="flex-start" display="none" $gtSm={{ display: 'flex' }}>
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16} onPress={handleBack}>
        {label}
      </VoxButton>
    </XStack>
  )
}
