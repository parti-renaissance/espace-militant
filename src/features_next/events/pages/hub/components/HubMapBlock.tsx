import type { ReactNode, Ref } from 'react'
import { useRef } from 'react'
import { View } from 'react-native'
import { Spinner, YStack } from 'tamagui'
import { Crosshair } from '@tamagui/lucide-icons'
import type { CameraPadding } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import { VoxButton } from '@/components/Button'
import { VoxBlurTarget } from '@/components/VoxBlur/VoxBlur'

import HubItemMap, { FRANCE_METRO_CAMERA_BOUNDS, HubItemMapHandle, HubItemMapItem } from '../../map/components/HubItemMap'
import { HubMapPromoOverlay } from './HubMapPromoOverlay'

export type HubMapBlockProps = {
  hubItemMapRef: Ref<HubItemMapHandle>
  mapItems: HubItemMapItem[]
  onItemPress: (event: OnPressEvent) => void
  onRecenterPress: () => void
  padding: CameraPadding
  isLocating: boolean
  userLocationLngLat?: [number, number] | null
  showLoadingSpinner: boolean
  /** Refetch discret (pas le chargement initial plein écran). */
  showFetchingIndicator?: boolean
  topInset: number
  promoLeadingAccessory?: ReactNode
  variant: 'fullscreen' | 'embedded'
}

export function HubMapBlock({
  hubItemMapRef,
  mapItems,
  onItemPress,
  onRecenterPress,
  padding,
  isLocating,
  userLocationLngLat,
  showLoadingSpinner,
  topInset,
  promoLeadingAccessory,
  variant,
}: HubMapBlockProps) {
  const blurTargetRef = useRef<View | null>(null)

  const content = (
    <>
      <YStack position="absolute" top={topInset === 0 ? '$medium' : 0} pt={topInset} right="$medium" zIndex={20}>
        <VoxButton
          variant="soft"
          size="lg"
          iconLeft={Crosshair}
          theme="gray"
          bg="$white1"
          onPress={onRecenterPress}
          aria-label="Centrer sur ma position"
          disabled={isLocating}
        >
          Recentrer
        </VoxButton>
      </YStack>
      <VoxBlurTarget ref={blurTargetRef} style={{ flex: 1, width: '100%' }}>
        <HubItemMap
          ref={hubItemMapRef}
          items={mapItems}
          isInteractive
          clusterItems={false}
          onItemPress={onItemPress}
          initialBounds={FRANCE_METRO_CAMERA_BOUNDS}
          padding={padding}
          userLocationLngLat={userLocationLngLat}
          embeddedInScrollView={variant === 'embedded'}
        />
      </VoxBlurTarget>
      <HubMapPromoOverlay blurTarget={blurTargetRef} leadingAccessory={promoLeadingAccessory} />
      {showLoadingSpinner && (
        <YStack position="absolute" right={0} bottom={0} pointerEvents="none">
          <Spinner size="large" />
        </YStack>
      )}
    </>
  )

  if (variant === 'embedded') {
    return (
      <YStack height={520} width="100%" flexShrink={0} overflow="hidden" position="relative">
        {content}
      </YStack>
    )
  }

  return (
    <YStack flex={1} position="relative" minHeight={0}>
      {content}
    </YStack>
  )
}
