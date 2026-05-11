import React, { memo } from 'react'
import { useRouter } from 'expo-router'
import { XStack, YStack } from 'tamagui'
import { List, Map } from '@tamagui/lucide-icons' // Assure-toi d'avoir ces icônes ou utilise tes propres IconComponent

export type MapListToggleProps = {
  activeView: 'map' | 'list'
  mapHref: string
  listHref: string
}

export const MapListToggle = memo(function MapListToggle({ activeView, mapHref, listHref }: MapListToggleProps) {
  const router = useRouter()

  const onMapPress = () => {
    if (activeView !== 'map') {
      router.replace(mapHref as any)
    }
  }

  const onListPress = () => {
    if (activeView !== 'list') {
      router.replace(listHref as any)
    }
  }

  // Sous-composant pour éviter la répétition du style des boutons
  const ToggleButton = ({ icon: Icon, isActive, onPress }: { icon: any; isActive: boolean; onPress: () => void }) => (
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

  return (
    <XStack bg="$background" borderRadius={99} p="$xsmall" gap={2} alignItems="center">
      <ToggleButton icon={Map} isActive={activeView === 'map'} onPress={onMapPress} />
      <ToggleButton icon={List} isActive={activeView === 'list'} onPress={onListPress} />
    </XStack>
  )
})
