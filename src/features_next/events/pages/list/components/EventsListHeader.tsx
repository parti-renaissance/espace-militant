import { useRouter } from 'expo-router'
import { useMedia, XStack, YStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import { QueryBoundary } from '@/components/QueryBoundary'
import BigSwitch from '@/components/base/BigSwitch'
import { MapListToggle } from '@/features_next/events/components/feed-layout/MapListToggle'
import { PinnedItemBanner } from '@/features_next/events/components/feed-layout/PinnedItemBanner'
import HubSideContent from '@/features_next/events/components/feed-layout/SideContent'

import { HUB_TABS } from '../helpers/constants'
import type { HubFeedTab } from '../types'

type EventsListHeaderProps = {
  activeTab: HubFeedTab
  isAuth: boolean
  onOpenOrganizeModal: () => void
  onSwitchChange: (value: string | undefined) => void
  pinnedBannerPaddingTop: number
}

export function EventsListHeader({ activeTab, isAuth, onOpenOrganizeModal, onSwitchChange, pinnedBannerPaddingTop }: EventsListHeaderProps) {
  const media = useMedia()
  const router = useRouter()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push('/evenements')
    }
  }

  return (
    <YStack>
      {media.sm ? (
        <YStack paddingTop={pinnedBannerPaddingTop} paddingBottom={16} gap="$medium">
          <XStack alignItems="center" justifyContent="space-between" gap="$small" px="$medium">
            <VoxButton variant="soft" size="lg" shrink iconLeft={ArrowLeft} theme="gray" bg="$white1" onPress={handleBack} aria-label="Retour " />
            <MapListToggle activeView="list" mapHref="/evenements/map" listHref="/evenements/list" />
          </XStack>
          <QueryBoundary>
            <PinnedItemBanner />
          </QueryBoundary>
        </YStack>
      ) : null}
      <YStack gap="$medium" px={media.sm ? '$medium' : 0}>
        {isAuth && <BigSwitch options={HUB_TABS} value={activeTab} onChange={onSwitchChange} />}
        {!media.gtMd && <HubSideContent onOpenOrganizeModal={onOpenOrganizeModal} />}
      </YStack>
    </YStack>
  )
}
