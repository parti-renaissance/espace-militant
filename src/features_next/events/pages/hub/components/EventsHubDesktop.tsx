import { Suspense, type ReactNode } from 'react'
import { YStack } from 'tamagui'

import HubEventFeed from './HubEventFeed'

export type EventsHubDesktopProps = {
  mapLayer: ReactNode
  feedSuspenseFallback: ReactNode
}

export function EventsHubDesktop({ mapLayer, feedSuspenseFallback }: EventsHubDesktopProps) {
  return (
    <>
      <YStack flex={1} position="relative">
        <YStack position="fixed" top={0} left={0} right={390} bottom={0}>
          {mapLayer}
        </YStack>
      </YStack>
      <YStack flex={1} flexShrink={0} minHeight={0} maxWidth={390} width="100%">
        <Suspense fallback={feedSuspenseFallback}>
          <HubEventFeed />
        </Suspense>
      </YStack>
    </>
  )
}
