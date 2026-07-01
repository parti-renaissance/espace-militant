import type { ReactNode, RefObject } from 'react'
import { memo, useCallback } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import { List, Map } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import Title from '@/components/Title/Title'
import VoxCard from '@/components/VoxCard/VoxCard'

type HubMapPromoOverlayProps = {
  leadingAccessory?: ReactNode
  blurTarget?: RefObject<View | null>
}

export const HubMapPromoOverlay = memo(function HubMapPromoOverlay({ leadingAccessory, blurTarget }: HubMapPromoOverlayProps) {
  const media = useMedia()
  const router = useRouter()
  const onOpenFullMap = useCallback(() => {
    router.push('/evenements/map')
  }, [router])
  const onOpenList = useCallback(() => {
    router.push('/evenements/list')
  }, [router])

  return (
    <XStack position="absolute" left={0} right={0} bottom={0} zIndex={10} p="$medium" pointerEvents="box-none" alignItems="flex-end" gap="$medium">
      {leadingAccessory}
      <VoxCard.Blur blurTarget={blurTarget} flexShrink={1} width="100%" maxWidth={media.gtXs ? 340 : undefined} borderRadius={16}>
        <VoxCard.Content>
          <YStack gap="$small">
            <Title size="h1">
              <Title.Text>Trouvez </Title.Text>
              <Title.Highlight>l’événement</Title.Highlight>
              <Title.Break />
              <Title.Highlight>qui vous convient</Title.Highlight>
            </Title>
          </YStack>
          <XStack gap="$small" width="100%" flexWrap="wrap">
            <VoxButton variant="outlined" theme="blue" size="md" flexGrow={1} iconLeft={Map} onPress={onOpenFullMap}>
              Ouvrir la carte
            </VoxButton>
            <VoxButton variant="contained" theme="blue" size="md" flexGrow={1} iconLeft={List} onPress={onOpenList}>
              Ouvrir la liste
            </VoxButton>
          </XStack>
        </VoxCard.Content>
      </VoxCard.Blur>
    </XStack>
  )
})
