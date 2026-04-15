import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getToken, useMedia, YStack } from 'tamagui'
import { ArrowLeft, CircleAlert } from '@tamagui/lucide-icons'
import { useDebouncedCallback } from 'use-debounce'

import { Layout, LayoutFlatList } from '@/components/AppStructure'
import Text from '@/components/base/Text'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import EmptyStateWithFilters from '@/components/EmptyStates/EmptyStateWithFilters'
import type { FilterValues } from '@/components/Filters/FilterCollectionBuilder'
import { getActiveFilterChips, normalizeFiltersForApi } from '@/components/Filters/filterCollectionUtils'
import PanelModal from '@/components/PanelModal/PanelModal'
import { MilitantCadreItem } from '@/features_next/militants/components/MilitantCadreItem'
import { MilitantDetailsPanel } from '@/features_next/militants/components/MilitantDetailsPanel'
import { MilitantExportButton } from '@/features_next/militants/components/MilitantExportButton'
import { MilitantFilterPanel } from '@/features_next/militants/components/MilitantFilterPanel'
import { MilitantHeaderPagination, MilitantListHeader } from '@/features_next/militants/components/MilitantListHeader'

import { useAdherentsPage } from '@/services/adherents/hook'
import { RestAdherentListItem } from '@/services/adherents/schema'
import { useGetFiltersCollection } from '@/services/filters-collection/hook'
import { useGetExecutiveScopes, useMutateExecutiveScope } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

import { ListSkeleton } from './components/ListSkeleton'
import { PAGE_SIZE } from './constants'

function MilitantsContent({ scope, accessDenyButton: _accessDenyButton }: { scope: string; accessDenyButton?: React.ReactNode }) {
  const media = useMedia()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState<FilterValues>({})
  const [isManualRefreshing, setIsManualRefreshing] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedUuid, setSelectedUuid] = useState<string | undefined>(undefined)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [apiSearchTerm, setApiSearchTerm] = useState('')

  const debouncedSetApiSearchTerm = useDebouncedCallback((value: string) => {
    setApiSearchTerm(value.trim())
  }, 400)

  useEffect(() => {
    debouncedSetApiSearchTerm(searchInput)
  }, [searchInput, debouncedSetApiSearchTerm])

  const { data: collection } = useGetFiltersCollection({
    featureKey: FEATURES.CONTACTS,
    scope,
  })
  const apiFilters = useMemo(() => normalizeFiltersForApi(filters), [filters])
  const { data, isLoading, isFetching, isPlaceholderData, refetch, isError, error } = useAdherentsPage({
    scope,
    page: currentPage,
    pageSize: PAGE_SIZE,
    searchTerm: apiSearchTerm || undefined,
    filters: apiFilters,
  })

  const { hasFeature } = useGetExecutiveScopes()
  const canExport = hasFeature(FEATURES.CONTACTS_EXPORT, scope)

  useEffect(() => {
    setCurrentPage(1)
  }, [apiSearchTerm, scope])

  const activeFilterChips = useMemo(() => getActiveFilterChips(filters, collection), [filters, collection])

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

  const lastPage = metadata?.total_items != null ? Math.ceil(metadata.total_items / PAGE_SIZE) : undefined
  const handlePageChange = useCallback((page: number) => setCurrentPage(() => Math.max(1, Math.min(page, lastPage ?? Infinity))), [lastPage])

  const handleFilterPress = useCallback(() => setIsFilterOpen(true), [])
  const handleCloseFilter = useCallback(() => setIsFilterOpen(false), [])
  const handleOpenDetail = useCallback((uuid: string) => {
    setSelectedUuid(uuid)
    setIsDetailOpen(true)
  }, [])
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false)
    setSelectedUuid(undefined)
  }, [])

  const handleChangeFilter = useCallback((values: FilterValues) => {
    setFilters(values)
    setCurrentPage(1)
  }, [])

  const handleRemoveFilter = useCallback((filterKey: string) => {
    setFilters((prev) => {
      const { [filterKey]: _, ...rest } = prev
      return rest
    })
    setCurrentPage(1)
  }, [])

  const handleResetAllFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  const headerComponent = useMemo(
    () => (
      <MilitantListHeader
        onFilterPress={handleFilterPress}
        activeFilterChips={activeFilterChips}
        onRemoveFilter={handleRemoveFilter}
        onResetAllFilters={handleResetAllFilters}
        paginationDisabled={isFetching}
        page={currentPage}
        pageSize={PAGE_SIZE}
        totalItems={metadata?.total_items}
        onPageChange={handlePageChange}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        paginationRightSlot={canExport ? <MilitantExportButton scope={scope} /> : null}
      />
    ),
    [
      handleFilterPress,
      activeFilterChips,
      handleRemoveFilter,
      handleResetAllFilters,
      isFetching,
      isPlaceholderData,
      currentPage,
      metadata?.total_items,
      handlePageChange,
      searchInput,
      scope,
      canExport,
    ],
  )

  const renderItem = useCallback(
    ({ item }: { item: RestAdherentListItem }) => {
      return <MilitantCadreItem key={item.uuid} {...item} onPress={() => handleOpenDetail(item.uuid)} />
    },
    [handleOpenDetail],
  )
  const selectedInitialData = useMemo(
    (): RestAdherentListItem | undefined => (selectedUuid ? (militants.find((m) => m.uuid === selectedUuid) as RestAdherentListItem | undefined) : undefined),
    [selectedUuid, militants],
  )

  const contentContainerStyle = useMemo(() => {
    const baseStyle: { gap: number; paddingTop?: number; marginTop?: number; paddingBottom: number } = {
      gap: getToken('$small', 'space'),
      paddingBottom: 300,
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

    if (isError) {
      return (
        <YStack gap="$medium" alignItems="center" justifyContent="center" flex={1} minHeight={300}>
          <CircleAlert size={48} color="$orange5" />
          <Text.SM color="$textDisabled" textAlign="center">
            {error?.message ?? 'Impossible de charger la liste des militants.'}
          </Text.SM>
          <YStack>
            <VoxButton theme="orange" size="sm" variant="outlined" onPress={() => refetch()}>
              Réessayer
            </VoxButton>
          </YStack>
        </YStack>
      )
    }

    if (!hasResolvedData || isPending) {
      return <ListSkeleton showHeader={false} />
    }
    return (
      <YStack gap="$medium" alignItems="center" justifyContent="center" flex={1} minHeight={300}>
        <EmptyStateWithFilters
          title="Aucun militant trouvé"
          subtitle={activeFilterChips && activeFilterChips.length > 0 ? 'Aucun militant ne correspond à vos filtres actifs' : undefined}
          onResetFilters={activeFilterChips && activeFilterChips.length > 0 ? handleResetAllFilters : undefined}
        />
      </YStack>
    )
  }, [data, isLoading, isFetching, isError, error?.message, refetch, activeFilterChips, handleResetAllFilters])

  const listFooterComponent = useMemo(
    () =>
      isError ? null : (
        <YStack py="$small" px={media.sm ? '$medium' : undefined} alignItems={media.sm ? 'stretch' : 'flex-end'}>
          <MilitantHeaderPagination
            page={currentPage}
            pageSize={PAGE_SIZE}
            totalItems={metadata?.total_items}
            onPageChange={handlePageChange}
            disabled={isFetching}
          />
        </YStack>
      ),
    [currentPage, metadata?.total_items, handlePageChange, isFetching, isError, media.sm],
  )

  return (
    <Layout.Main maxWidth={892}>
      <LayoutFlatList<RestAdherentListItem>
        padding={media.sm ? false : undefined}
        data={militants as RestAdherentListItem[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={listFooterComponent}
        refreshing={isManualRefreshing}
        onRefresh={handleManualRefresh}
        contentContainerStyle={contentContainerStyle}
      />
      <PanelModal isOpen={isFilterOpen} onClose={handleCloseFilter}>
        <MilitantFilterPanel
          scope={scope}
          initialValues={filters}
          onChangeFilter={handleChangeFilter}
          onClose={handleCloseFilter}
          hiddenFilterCodes={['search_term']}
        />
      </PanelModal>
      <MilitantDetailsPanel uuid={selectedUuid} scope={scope} isOpen={isDetailOpen} onClose={handleCloseDetail} initialData={selectedInitialData} />
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

  return (
    <BoundarySuspenseWrapper>
      <MilitantsContent scope={defaultScope} accessDenyButton={accessDenyButton} />
    </BoundarySuspenseWrapper>
  )
}
