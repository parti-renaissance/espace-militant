import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getToken, useMedia, YStack } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

import { Layout, LayoutFlatList } from '@/components/AppStructure'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import PanelOrBottomSheet from '@/components/PanelOrBottomSheet/PanelOrBottomSheet'
import { MilitantCadreItem } from '@/features_next/militants/components/MilitantCadreItem'
import { MilitantFilterPanel } from '@/features_next/militants/components/MilitantFilterPanel'
import { MilitantListHeader } from '@/features_next/militants/components/MilitantListHeader'

import { useAdherentsPage } from '@/services/adherents/hook'
import { RestAdherentListItem } from '@/services/adherents/schema'
import { useGetExecutiveScopes, useMutateExecutiveScope } from '@/services/profile/hook'

import { ListSkeleton } from './components/ListSkeleton'

const PAGE_SIZE = 25

function MilitantsContent({ scope, accessDenyButton: _accessDenyButton }: { scope: string; accessDenyButton?: React.ReactNode }) {
  const media = useMedia()
  const [currentPage, setCurrentPage] = useState(1)
  const [isManualRefreshing, setIsManualRefreshing] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { data, isLoading, isFetching, isPlaceholderData, refetch } = useAdherentsPage(scope, currentPage, PAGE_SIZE)

  const metadata = data?.metadata
  const militants = useMemo(() => (isPlaceholderData ? [] : (data?.items ?? [])), [isPlaceholderData, data?.items])

  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsManualRefreshing(false)
    }
  }, [refetch])

  const isPrevDisabled = currentPage <= 1
  const isNextDisabled = !metadata || currentPage >= metadata.last_page

  const handlePrevPage = useCallback(() => {
    if (!isPrevDisabled) setCurrentPage((p) => p - 1)
  }, [isPrevDisabled])

  const handleNextPage = useCallback(() => {
    if (!isNextDisabled) setCurrentPage((p) => p + 1)
  }, [isNextDisabled])

  const total = metadata?.total_items
  const isPageTransition = isFetching && metadata && currentPage !== metadata.current_page
  const pageStart = useMemo(() => {
    if (isPageTransition || (isPlaceholderData && metadata)) {
      return (currentPage - 1) * PAGE_SIZE + 1
    }
    return metadata ? (metadata.current_page - 1) * metadata.items_per_page + 1 : undefined
  }, [isPageTransition, isPlaceholderData, metadata, currentPage])
  const pageEnd = useMemo(() => {
    if (isPageTransition || (isPlaceholderData && metadata)) {
      return Math.min(currentPage * PAGE_SIZE, metadata.total_items)
    }
    return metadata ? Math.min(metadata.current_page * metadata.items_per_page, metadata.total_items) : undefined
  }, [isPageTransition, isPlaceholderData, metadata, currentPage])

  const handleFilterPress = useCallback(() => setIsFilterOpen(true), [])
  const handleCloseFilter = useCallback(() => setIsFilterOpen(false), [])

  const headerComponent = useMemo(
    () => (
      <MilitantListHeader
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        pageStart={pageStart}
        pageEnd={pageEnd}
        total={total}
        onFilterPress={handleFilterPress}
      />
    ),
    [isPrevDisabled, isNextDisabled, handlePrevPage, handleNextPage, pageStart, pageEnd, total, handleFilterPress],
  )

  const renderItem = useCallback(({ item }: { item: RestAdherentListItem }) => {
    return <MilitantCadreItem key={item.uuid} {...item} onPress={() => console.log(`MilitantCadreItem pressed ${item.uuid}`)} />
  }, [])

  const contentContainerStyle = useMemo(() => {
    const baseStyle: { gap: number; paddingTop?: number; marginTop?: number } = {
      gap: getToken('$small', 'space'),
    }
    if (media.sm) {
      baseStyle.paddingTop = 0
      baseStyle.marginTop = -1
    }
    return baseStyle
  }, [media.sm])

  const listEmptyComponent = useMemo(() => {
    const hasResolvedData = data != null
    const isPending = isLoading || isFetching
    if (!hasResolvedData || isPending) {
      return <ListSkeleton showHeader={false} />
    }
    return (
      <YStack gap="$medium">
        <Text.SM secondary>Aucun militant pour le moment.</Text.SM>
      </YStack>
    )
  }, [data, isLoading, isFetching])

  return (
    <Layout.Main maxWidth={892}>
      <LayoutFlatList<RestAdherentListItem>
        padding={media.sm ? false : undefined}
        data={militants as RestAdherentListItem[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={listEmptyComponent}
        refreshing={isManualRefreshing}
        onRefresh={handleManualRefresh}
        contentContainerStyle={contentContainerStyle}
      />
      <PanelOrBottomSheet isOpen={isFilterOpen} onClose={handleCloseFilter}>
        <MilitantFilterPanel />
      </PanelOrBottomSheet>
    </Layout.Main>
  )
}

export default function MilitantsScreen() {
  const { data: scopes } = useGetExecutiveScopes()
  const { mutate: mutateScope } = useMutateExecutiveScope()
  const defaultScope = useMemo(() => scopes?.default?.code || '', [scopes?.default?.code])
  const previousScopeRef = useRef<string | null>(null)
  const [previousScope, setPreviousScope] = useState<string | null>(null)

  useEffect(() => {
    if (previousScopeRef.current !== null && previousScopeRef.current !== defaultScope) {
      setPreviousScope(previousScopeRef.current)
    } else if (previousScopeRef.current === defaultScope) {
      setPreviousScope(null)
    }
    previousScopeRef.current = defaultScope
  }, [defaultScope])

  const handleReturnToPreviousScope = useCallback(() => {
    if (previousScope) {
      mutateScope({ scope: previousScope })
      setPreviousScope(null)
    }
  }, [mutateScope, previousScope])

  const accessDenyButton = previousScope ? (
    <VoxButton theme="purple" iconLeft={ArrowLeft} onPress={handleReturnToPreviousScope}>
      Revenir au rôle précédent
    </VoxButton>
  ) : undefined

  return <MilitantsContent scope={defaultScope} accessDenyButton={accessDenyButton} />
}
