import React from 'react'
import { Href, useRouter } from 'expo-router'
import { XStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

interface ContentBackButtonProps {
  fallbackPath?: Href
  label?: string
  showOnMobile?: boolean
}

export const ContentBackButton = ({ fallbackPath = '/' as Href, label = 'Retour', showOnMobile = false }: ContentBackButtonProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }
    router.replace(fallbackPath)
  }

  return (
    <XStack
      alignItems="flex-start"
      alignSelf="flex-start"
      display={showOnMobile ? 'flex' : 'none'}
      pb={showOnMobile ? '$medium' : 0}
      $gtSm={{ display: 'flex', pb: '$medium' }}
    >
      <VoxButton variant="text" iconLeft={ArrowLeft} borderRadius={16} onPress={handleBack}>
        {label}
      </VoxButton>
    </XStack>
  )
}
