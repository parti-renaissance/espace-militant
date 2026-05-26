import type { ReactNode } from 'react'
import { memo, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import { List, Map } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'

type HubMapPromoOverlayProps = {
  leadingAccessory?: ReactNode
}

export const HubMapPromoOverlay = memo(function HubMapPromoOverlay({ leadingAccessory }: HubMapPromoOverlayProps) {
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
      <VoxCard flexShrink={1} width="100%" maxWidth={media.gtXs ? 340 : undefined} borderRadius={16}>
        <VoxCard.Content>
          <YStack gap="$small">
            <Text.MD semibold>Trouvez l’événement qui vous convient</Text.MD>
            <Text.MD secondary>Participez à nos meetings et mobilisez-vous sur le terrain avec la communauté militante.</Text.MD>
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
      </VoxCard>
    </XStack>
  )
})
