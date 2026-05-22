/**
 * Liste minimaliste du hub : bannière épinglée + inscriptions à venir uniquement.
 */
import type { ReactNode } from 'react'
import { memo, useCallback, useMemo, useRef } from 'react'
import { FlatList, Platform } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import { getToken, Spinner, XStack, YStack } from 'tamagui'
import { Calendar, CalendarCheck2, ChevronRight, ClipboardCheck, DoorOpen, Zap } from '@tamagui/lucide-icons'

import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import Text from '@/components/base/Text'
import { QueryBoundary } from '@/components/QueryBoundary'
import HubListSkeleton from '@/features_next/events/components/feed-layout/HubListSkeleton'
import { PinnedItemBanner } from '@/features_next/events/components/feed-layout/PinnedItemBanner'
import { HubFeedRow } from '@/features_next/events/components/list-item/HubFeedRow'

import { useSession } from '@/ctx/SessionProvider'
import { useHubItemsInfiniteQuery } from '@/services/hub/hook'
import { mapHubItemToFeedRow, type HubFeedRow as HubFeedRowType } from '@/services/hub/mapper'
import type { RestHubItem } from '@/services/hub/schema'
import { useGetProfil } from '@/services/profile/hook'

import { ButtonCard } from './ButtonCard'

const mapHubItemsToFeedRows = (items: RestHubItem[]): HubFeedRowType[] => items.map(mapHubItemToFeedRow).filter((row): row is HubFeedRowType => row !== null)

const getFeedRowKey = (row: HubFeedRowType): string =>
  row.type === 'event' ? row.event.uuid : (row.payload.id ?? `action-${row.payload.date.start.toISOString()}`)

const HubOrganizePromptCards = memo(function HubOrganizePromptCards({ onOpenOrganizeModal }: { onOpenOrganizeModal: () => void }) {
  return (
    <XStack gap="$medium" px="$medium">
      <YStack width="50%" flex={1}>
        <ButtonCard theme="green" icon={Zap} label="Organisez une action près de chez vous" onPress={onOpenOrganizeModal} />
      </YStack>
      <YStack width="50%" flex={1}>
        <ButtonCard theme="blue" icon={Calendar} label="Organisez un événement" onPress={onOpenOrganizeModal} />
      </YStack>
    </XStack>
  )
})

const HubFooterResourceCards = memo(function HubFooterResourceCards() {
  return (
    <>
      <ButtonCard
        horizontal
        icon={ClipboardCheck}
        rightIcon={ChevronRight}
        label="Questionnaires de terrain"
        description="Allez à la rencontre de nos électeurs, sur les marchés, dans la rue ou en porte à porte."
        href="/questionnaires"
      />
      <ButtonCard
        horizontal
        icon={DoorOpen}
        rightIcon={ChevronRight}
        label="Porte-à-porte"
        description="Consultez la carte des adresses prioritaires pour organiser votre porte-à-porte."
        href="/old/porte-a-porte"
      />
    </>
  )
})

type HubEventFeedProps = {
  /** Carte hub en tête du scroll (mobile) — doit avoir une hauteur fixe. */
  embeddedMapHeader?: ReactNode
  /** Marge sous le contenu pour la tab bar + safe area. */
  listContentInsetBottom?: number
  onOpenOrganizeModal: () => void
}

const HubEventFeed = (props: HubEventFeedProps) => {
  const { embeddedMapHeader, listContentInsetBottom = 0, onOpenOrganizeModal } = props
  const { session, isAuth } = useSession()
  const { data: userData } = useGetProfil({ enabled: Boolean(session) })
  const filtersReady = !isAuth || userData !== undefined

  const { data, fetchNextPage, hasNextPage, isRefetching, isFetching } = useHubItemsInfiniteQuery({
    params: { subscribedOnly: true, upcomingOnly: true },
    enabled: filtersReady && isAuth,
  })

  const hubItems = useMemo(() => data?.pages.flatMap((page) => page?.items ?? []) ?? [], [data?.pages])
  const feedRows = useMemo(() => mapHubItemsToFeedRows(hubItems), [hubItems])

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isRefetching) void fetchNextPage()
  }, [fetchNextPage, hasNextPage, isRefetching])

  const showSkeleton = !filtersReady || (isFetching && feedRows.length === 0)

  const listRef = useRef<FlatList<HubFeedRowType>>(null)
  useScrollToTop(listRef)

  const listHeader = (
    <YStack pt="$medium" gap={24}>
      <QueryBoundary>
        <PinnedItemBanner small />
      </QueryBoundary>
      <HubOrganizePromptCards onOpenOrganizeModal={onOpenOrganizeModal} />
      <YStack px="$medium" gap="$medium">
        <XStack gap="$small">
          <CalendarCheck2 size={16} color="$blue5" />
          <Text.MD semibold>Mon agenda</Text.MD>
        </XStack>
        {hubItems.length > 0 ? (
          <Text.MD secondary semibold>
            Vous avez {hubItems.length} inscription{hubItems.length > 1 ? 's' : ''} à venir.
          </Text.MD>
        ) : null}
      </YStack>
    </YStack>
  )

  const listHeaderComponent =
    embeddedMapHeader != null ? (
      <>
        {embeddedMapHeader}
        {listHeader}
      </>
    ) : (
      listHeader
    )

  const contentContainerStyleMerged = useMemo(
    () => ({
      gap: getToken('$medium', 'space'),
      ...(listContentInsetBottom > 0 ? { paddingBottom: listContentInsetBottom } : {}),
    }),
    [listContentInsetBottom],
  )

  const listEmptyComponent = useMemo(() => {
    return (
      <YStack px="$medium">
        <Text.MD secondary semibold lineHeight={22}>
          Votre agenda est vide. Vous retrouverez ici vos événements et actions à venir auxquels vous participez.
        </Text.MD>
      </YStack>
    )
  }, [])

  return (
    <YStack flex={1} width="100%" minHeight={0} bg="$textSurface">
      <LayoutFlatList<HubFeedRowType>
        ref={listRef}
        padding={false}
        data={feedRows}
        keyExtractor={getFeedRowKey}
        renderItem={({ item }) => <HubFeedRow row={item} userUuid={userData?.uuid} source="page_events_hub" />}
        ListHeaderComponent={listHeaderComponent}
        contentContainerStyle={contentContainerStyleMerged}
        removeClippedSubviews={embeddedMapHeader != null && Platform.OS !== 'web' ? false : undefined}
        nestedScrollEnabled={embeddedMapHeader != null && Platform.OS === 'android'}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        hasMore={hasNextPage ?? false}
        ListEmptyComponent={showSkeleton ? <HubListSkeleton /> : listEmptyComponent}
        ListFooterComponent={
          <YStack>
            {hasNextPage ? (
              <YStack padding="$medium" alignItems="center">
                <Spinner size="large" />
              </YStack>
            ) : null}
            <YStack width="100%" px="$medium" pb="$medium" pt="$small" alignItems="stretch" gap="$medium">
              <HubFooterResourceCards />
            </YStack>
          </YStack>
        }
      />
    </YStack>
  )
}

export default HubEventFeed
