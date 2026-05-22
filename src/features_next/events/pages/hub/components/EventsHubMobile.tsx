import { Suspense, type ReactNode } from 'react'
import { YStack } from 'tamagui'

import HubEventFeed from './HubEventFeed'

export type EventsHubMobileProps = {
  embeddedMapHeader: ReactNode
  tabBarSafeBottom: number
  feedSuspenseFallback: ReactNode
  onOpenOrganizeModal: () => void
}

export function EventsHubMobile({ embeddedMapHeader, tabBarSafeBottom, feedSuspenseFallback, onOpenOrganizeModal }: EventsHubMobileProps) {
  return (
    <YStack flex={1} width="100%" minHeight={0}>
      <Suspense fallback={feedSuspenseFallback}>
        <HubEventFeed
          embeddedMapHeader={embeddedMapHeader}
          listContentInsetBottom={tabBarSafeBottom}
          onOpenOrganizeModal={onOpenOrganizeModal}
        />
      </Suspense>
    </YStack>
  )
}
