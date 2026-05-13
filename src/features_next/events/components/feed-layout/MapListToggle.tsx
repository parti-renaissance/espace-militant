import React, { memo } from 'react'
import { type Href, useRouter } from 'expo-router'
import { XStack, YStack } from 'tamagui'
import { List, Map } from '@tamagui/lucide-icons'

import type { IconComponent } from '@/models/common.model'

export type MapListToggleProps = {
  activeView: 'map' | 'list'
  mapHref: Href
  listHref: Href
}

type ToggleButtonProps = {
  icon: IconComponent
  isActive: boolean
  onPress: () => void
}

function ToggleButton({ icon: Icon, isActive, onPress }: ToggleButtonProps) {
  return (
    <YStack
      width={36}
      height={36}
      borderRadius={99}
      alignItems="center"
      justifyContent="center"
      bg={isActive ? '$textOutline' : 'transparent'}
      cursor={isActive ? 'default' : 'pointer'}
      onPress={onPress}
      hoverStyle={!isActive ? { bg: '$textOutline20' } : undefined}
      pressStyle={!isActive ? { bg: '$textOutline20', opacity: 0.6 } : undefined}
      animation="quick"
    >
      <Icon size={16} color="$textPrimary" />
    </YStack>
  )
}

export const MapListToggle = memo(function MapListToggle({ activeView, mapHref, listHref }: MapListToggleProps) {
  const router = useRouter()

  const onMapPress = () => {
    if (activeView !== 'map') {
      router.replace(mapHref)
    }
  }

  const onListPress = () => {
    if (activeView !== 'list') {
      router.replace(listHref)
    }
  }

  return (
    <XStack bg="$background" borderRadius={99} p="$xsmall" gap={2} alignItems="center">
      <ToggleButton icon={Map} isActive={activeView === 'map'} onPress={onMapPress} />
      <ToggleButton icon={List} isActive={activeView === 'list'} onPress={onListPress} />
    </XStack>
  )
})
