/**
 * Liste minimaliste du hub : bannière épinglée + inscriptions à venir uniquement.
 */
import type { ReactNode } from 'react'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, Platform } from 'react-native'
import { useScrollToTop } from "expo-router/react-navigation"
import { Link, router } from 'expo-router'
import { getToken, Image, Spinner, XStack, YStack } from 'tamagui'
import { CalendarCheck2, ClipboardCheck, DoorOpen, Plus } from '@tamagui/lucide-icons'

import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import CallToActionCard from '@/components/CallToActionCard/CallToActionCard'
import IconTitleRow from '@/components/CallToActionCard/IconTitleRow'
import { QueryBoundary } from '@/components/QueryBoundary'
import Title from '@/components/Title/Title'
import ILLUMATERIEL from '@/features_next/events/assets/images/illu-materiel.png'
import HubListSkeleton from '@/features_next/events/components/feed-layout/HubListSkeleton'
import { PinnedItemBanner } from '@/features_next/events/components/feed-layout/PinnedItemBanner'
import { HubFeedRow } from '@/features_next/events/components/list-item/HubFeedRow'
import { useCanOrderMateriel } from '@/features_next/events/hooks/useCanOrderMateriel'
import { useProfileCompletionAccess } from '@/features_next/profil/hooks/useProfileCompletionAccess'

import { useSession } from '@/ctx/SessionProvider'
import { useHubItemsInfiniteQuery } from '@/services/hub/hook'
import { HIT_SOURCES } from '@/services/hits/constants'
import { mapHubItemToFeedRow, type HubFeedRow as HubFeedRowType } from '@/services/hub/mapper'
import type { RestHubItem } from '@/services/hub/schema'
import { useGetProfil } from '@/services/profile/hook'
import { openExternalLink } from '@/utils/linkHandler'

import { MaterielOrderAccessModal } from './MaterielOrderAccessModal'

const mapHubItemsToFeedRows = (items: RestHubItem[]): HubFeedRowType[] => items.map(mapHubItemToFeedRow).filter((row): row is HubFeedRowType => row !== null)

const getFeedRowKey = (row: HubFeedRowType): string =>
  row.type === 'event' ? row.event.uuid : (row.payload.id ?? `action-${row.payload.date.start.toISOString()}`)

const MATERIEL_URL = 'https://attal.app/commande-materiel'
const PAP_HREF = '/porte-a-porte' as const

const HubOrganizePromptCards = memo(function HubOrganizePromptCards({
  hubItems,
  onOpenOrganizeModal,
}: {
  hubItems: RestHubItem[]
  onOpenOrganizeModal: () => void
}) {
  const { data: user } = useGetProfil()
  const { runWithCompleteProfile } = useProfileCompletionAccess()
  const { canOrderMateriel, isLoading: isAccessLoading } = useCanOrderMateriel(hubItems)
  const [accessModalOpen, setAccessModalOpen] = useState(false)

  const handleCommanderMateriel = useCallback(() => {
    const proceed = () => {
      if (canOrderMateriel) {
        void openExternalLink(MATERIEL_URL, { public_id: user?.id })
        return
      }
      setAccessModalOpen(true)
    }

    if (isAccessLoading) {
      return
    }

    runWithCompleteProfile(proceed, { onSuccess: proceed })
  }, [canOrderMateriel, isAccessLoading, runWithCompleteProfile, user?.id])

  return (
    <YStack gap="$medium" px="$medium">
      <CallToActionCard
        backgroundColor="$pink100"
        title="J’organise un événement près de chez moi"
        description="Tractage, collage, porte-à-porte, boîtage, ..."
      >
        <VoxButton variant="contained" theme="pink" iconLeft={Plus} onPress={onOpenOrganizeModal}>
          Organiser un événement
        </VoxButton>
      </CallToActionCard>
      <XStack backgroundColor="$white0" borderRadius="$medium" padding="$medium" gap="$medium">
        <Image source={ILLUMATERIEL} width={84} height={112} objectFit="contain" />
        <YStack gap="$medium" flexShrink={1}>
          <YStack gap="$small">
            <IconTitleRow
              title={
                <Title size="h2">
                  <Title.Text>Je Commande du matériel</Title.Text>
                </Title>
              }
            />
            <Text.SM color="$gray6" regular>
              Recevez gratuitement tracts et affiches officiels pour vos actions.
            </Text.SM>
          </YStack>

          <YStack gap={12}>
            <VoxButton variant="soft" theme="gray" onPress={handleCommanderMateriel}>
              Commander
            </VoxButton>
          </YStack>
        </YStack>
      </XStack>
      <MaterielOrderAccessModal open={accessModalOpen} onClose={() => setAccessModalOpen(false)} onOpenOrganizeModal={onOpenOrganizeModal} />
    </YStack>
  )
})

const HubFooterResourceCards = memo(function HubFooterResourceCards() {
  const { isAuth } = useSession()
  const { runWithCompleteProfile } = useProfileCompletionAccess()

  const handleOpenPap = useCallback(() => {
    runWithCompleteProfile(
      () => {
        router.push(PAP_HREF)
      },
      { redirectTo: PAP_HREF },
    )
  }, [runWithCompleteProfile])

  return (
    <>
      <CallToActionCard
        icon={ClipboardCheck}
        title="Je prends l’avis du terrain"
        description="Allez à la rencontre de nos électeurs, sur les marchés, dans la rue ou en porte à porte."
      >
        <Link href="/questionnaires" asChild>
          <VoxButton variant="soft" theme="gray">
            Voir les questionnaires
          </VoxButton>
        </Link>
      </CallToActionCard>
      {isAuth ? (
        <CallToActionCard
          icon={DoorOpen}
          title="Je fais un Porte-à-porte"
          description="Consultez la carte des adresses prioritaires pour organiser votre porte-à-porte."
        >
          <VoxButton variant="soft" theme="gray" onPress={handleOpenPap}>
            Plateforme de PAP
          </VoxButton>
        </CallToActionCard>
      ) : null}
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
      <HubOrganizePromptCards hubItems={hubItems} onOpenOrganizeModal={onOpenOrganizeModal} />
      <YStack px="$medium" gap="$medium">
        <IconTitleRow icon={CalendarCheck2} title="Mon agenda" />
        {hubItems.length > 0 ? (
          <Text.MD secondary semibold>
            Vous avez {hubItems.length} événement{hubItems.length > 1 ? 's' : ''} à venir auquel vous êtes inscrit.
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
          Vous n’êtes inscrit à aucun événement. Vous retrouverez ici tous les événements à venir auxquels vous vous inscrirez.
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
        renderItem={({ item }) => <HubFeedRow row={item} userUuid={userData?.uuid} source={HIT_SOURCES.PAGE_EVENTS_HUB} />}
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
