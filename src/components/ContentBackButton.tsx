import React from 'react'
import { Platform } from 'react-native'
import { Href, useRouter } from 'expo-router'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'
import { VoxButton } from '@/components/Button'

interface ContentBackButtonProps {
  fallbackPath?: Href
  label?: string
}

export const ContentBackButton = ({ 
  fallbackPath = '/' as Href, 
  label = 'Retour' 
}: ContentBackButtonProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (Platform.OS === 'web') {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace(fallbackPath)
      }
    } else {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.dismissAll()
      }
    }
  }

  return (
    <XStack 
      alignItems="flex-start" 
      alignSelf="flex-start"
      display="none"
      $gtSm={{ display: 'flex' }}
    >
      <VoxButton 
        variant="text" 
        iconLeft={ArrowLeft} 
        borderRadius={16}
        onPress={handleBack}
      >
        {label}
      </VoxButton>
    </XStack>
  )
}

