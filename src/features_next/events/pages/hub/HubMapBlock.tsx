import type { ReactNode, Ref } from 'react'
import { Spinner, YStack } from 'tamagui'
import { Crosshair } from '@tamagui/lucide-icons'
import type { CameraPadding } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/src/types/OnPressEvent'

import { VoxButton } from '@/components/Button'

import EventMap, { EventMapHandle, EventMapItem, FRANCE_METRO_CAMERA_BOUNDS } from '../map/EventMap'
import { HubMapPromoOverlay } from './HubMapPromoOverlay'

export type HubMapBlockProps = {
  eventMapRef: Ref<EventMapHandle>
  mapEvents: EventMapItem[]
  onEventPress: (event: OnPressEvent) => void
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
  eventMapRef,
  mapEvents,
  onEventPress,
  onRecenterPress,
  padding,
  isLocating,
  userLocationLngLat,
  showLoadingSpinner,
  showFetchingIndicator = false,
  topInset,
  promoLeadingAccessory,
  variant,
}: HubMapBlockProps) {
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
      <EventMap
        ref={eventMapRef}
        events={mapEvents}
        isInteractive
        clusterEvents={false}
        onEventPress={onEventPress}
        initialBounds={FRANCE_METRO_CAMERA_BOUNDS}
        padding={padding}
        userLocationLngLat={userLocationLngLat}
      />
      <HubMapPromoOverlay leadingAccessory={promoLeadingAccessory} />
      {showFetchingIndicator && (
        <YStack position="absolute" top={topInset === 0 ? '$medium' : 0} pt={topInset} left={0} right={0} alignItems="center" pointerEvents="none" zIndex={15}>
          <Spinner size="small" />
        </YStack>
      )}
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
