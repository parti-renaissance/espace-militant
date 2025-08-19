import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { XStack, YStack, useMedia } from 'tamagui'
import { ActivityIndicator, Platform, SafeAreaView } from 'react-native'
import { Save } from '@tamagui/lucide-icons'
import { VoxButton } from '@/components/Button'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import Text from '@/components/base/Text'
import { SelectFrames as SF } from '@/components/base/Select/Frames'
import QuickFilter from './QuickFilter'
import AdvancedFilters from './AdvancedFilters'
import { useGetMessageCountRecipientsPartial } from '@/services/publications/hook';
import { getHierarchicalQuickFilters, getItemState } from './helpers';
import { SelectedFiltersType, HierarchicalQuickFilterType } from './type';
import { useQueryClient } from '@tanstack/react-query'
import { GlobalSearch, ZoneProvider } from '@/components/GlobalSearch'
import SwitchV2 from '@/components/base/SwitchV2/SwitchV2'

// Type pour les zones
type Zone = {
  uuid: string
  name: string
  code: string
  type: string
}

interface SelectFiltersProps {
  onFiltersChange?: ({ newFilters, newQuickFilterId }: { newFilters: SelectedFiltersType, newQuickFilterId: string | null }) => void
  selectedFilters?: SelectedFiltersType
  selectedQuickFilterId?: string | null
  messageId?: string
  scope?: string
  isLoading?: boolean
  hasError?: boolean
}

export default function SelectFilters({
  onFiltersChange,
  selectedFilters = {},
  selectedQuickFilterId = null,
  messageId,
  scope,
  isLoading = false,
  hasError = false
}: SelectFiltersProps) {
  const media = useMedia()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedQuickFilter, setTempSelectedQuickFilter] = useState<string | null>(selectedQuickFilterId || null)
  const [tempSelectedFilters, setTempSelectedFilters] = useState<SelectedFiltersType>(selectedFilters)
  const [isAdvancedFilters, setIsAdvancedFilters] = useState(false)
  const quickFilters: HierarchicalQuickFilterType[] = useMemo(() => getHierarchicalQuickFilters(), [])
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsAdvancedFilters(selectedQuickFilterId ? false : true)
  }, [selectedQuickFilterId])


  const zoneProvider = useMemo(() => new ZoneProvider(), [])

  // Fonction pour fusionner les filtres du filtre rapide avec les filtres avancés
  const mergeQuickFilterWithAdvancedFilters = useCallback((quickFilter: HierarchicalQuickFilterType, currentFilters: SelectedFiltersType, isAdvancedMode: boolean = false) => {
    const mergedFilters = { ...quickFilter.filters }
    if (isAdvancedMode) {
      // En mode avancé avec filtre rapide : on fusionne les deux, on ne réinitialise rien
      // Les filtres avancés ont la priorité sur les filtres du filtre rapide
      Object.keys(currentFilters).forEach(filterKey => {
        if (currentFilters[filterKey] !== null && currentFilters[filterKey] !== undefined) {
          mergedFilters[filterKey] = currentFilters[filterKey]
        }
      })
    } else {
      // En mode filtres rapides : on réinitialise les filtres avancés non protégés
      const protectedFilters = ['zone', 'zones', 'committee']

      Object.keys(currentFilters).forEach(filterKey => {
        if (!(filterKey in quickFilter.filters) &&
          !protectedFilters.includes(filterKey) &&
          currentFilters[filterKey] !== null) {
          mergedFilters[filterKey] = null
        }
      })
    }

    return mergedFilters
  }, [])

  const zoneDefaultValue = useMemo(() => {
    if (selectedFilters.zone && typeof selectedFilters.zone === 'object' && 'name' in selectedFilters.zone && 'code' in selectedFilters.zone) {
      return {
        label: `${selectedFilters.zone.name} (${selectedFilters.zone.code})`,
        value: selectedFilters.zone.uuid
      }
    }

    if (selectedFilters.zones && Array.isArray(selectedFilters.zones) && selectedFilters.zones.length > 0) {
      const firstZone = selectedFilters.zones[0]
      if (firstZone && typeof firstZone === 'object' && 'name' in firstZone && 'code' in firstZone) {
        return {
          label: `${firstZone.name} (${firstZone.code})`,
          value: firstZone.uuid
        }
      }
    }

    if (selectedFilters.committee && typeof selectedFilters.committee === 'object' && 'name' in selectedFilters.committee) {
      return {
        label: selectedFilters.committee.name,
        value: null
      }
    }

    return undefined
  }, [isModalOpen]) // update defaultValue only when modal state changes

  const displayText = useMemo(() => {
    if (selectedQuickFilterId && !isAdvancedFilters) {
      const item = quickFilters.find(d => d.value === selectedQuickFilterId)
      return item ? item.label : 'Sélectionné'
    }

    const excludedFilters = ['zone', 'zones', 'committee']
    const nonNullFilters = Object.entries(selectedFilters).filter(([key, value]) =>
      value !== null && value !== undefined && !excludedFilters.includes(key)
    )
    return nonNullFilters.length > 0
      ? `${nonNullFilters.length} filtre${nonNullFilters.length > 1 ? 's' : ''} avancé${nonNullFilters.length > 1 ? 's' : ''}`
      : 'Sélectionner'
  }, [selectedQuickFilterId, quickFilters, selectedFilters, isAdvancedFilters])

  const { data: messageCountRecipients, isFetching: isFetchingMessageCountRecipients } = useGetMessageCountRecipientsPartial({ messageId: messageId, scope: scope })

  // Synchroniser tempSelectedFilters quand selectedFilters change
  useEffect(() => {
    setTempSelectedFilters(selectedFilters)
  }, [selectedFilters])

  // Synchroniser tempSelectedFilters quand selectedQuickFilterId change
  useEffect(() => {
    if (selectedQuickFilterId) {
      const selectedQuickFilter = quickFilters.find(qf => qf.value === selectedQuickFilterId)
      if (selectedQuickFilter) {
        setTempSelectedFilters(selectedQuickFilter.filters)
      }
    }
  }, [selectedQuickFilterId, quickFilters])

  const handleOpenModal = useCallback(() => {
    const quickFilterToUse = selectedQuickFilterId || (() => {
      const matchingQuickFilter = quickFilters.find(qf =>
        JSON.stringify(qf.filters) === JSON.stringify(selectedFilters)
      )
      return matchingQuickFilter?.value || 'adherents'
    })()

    setTempSelectedQuickFilter(quickFilterToUse)
    setTempSelectedFilters(selectedFilters)
    setIsModalOpen(true)
  }, [selectedQuickFilterId, quickFilters, selectedFilters])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleConfirmSelection = useCallback(() => {
    if (tempSelectedQuickFilter) {
      const selectedQuickFilter = quickFilters.find(qf => qf.value === tempSelectedQuickFilter)

      if (selectedQuickFilter) {
        const mergedFilters = mergeQuickFilterWithAdvancedFilters(selectedQuickFilter, tempSelectedFilters, isAdvancedFilters)
        onFiltersChange?.({ newFilters: mergedFilters, newQuickFilterId: tempSelectedQuickFilter })
      }
    } else {
      onFiltersChange?.({ newFilters: tempSelectedFilters, newQuickFilterId: null })
    }
    queryClient.refetchQueries({
      queryKey: ['message-count-recipients', messageId],
    })
    handleCloseModal()
  }, [tempSelectedQuickFilter, quickFilters, tempSelectedFilters, mergeQuickFilterWithAdvancedFilters, onFiltersChange, queryClient, messageId, handleCloseModal, isAdvancedFilters])

  const handleItemSelection = useCallback((itemId: string, immediateChange: boolean = false) => {
    const item = quickFilters.find(d => d.value === itemId)
    if (!item) return
    if (tempSelectedQuickFilter === itemId) return

    setTempSelectedQuickFilter(itemId)

    if (immediateChange) {
      // Utiliser la fonction de fusion pour la sauvegarde immédiate
      const mergedFilters = mergeQuickFilterWithAdvancedFilters(item, tempSelectedFilters, isAdvancedFilters)
      onFiltersChange?.({ newFilters: mergedFilters, newQuickFilterId: itemId })
    } else {
      // Mettre à jour tempSelectedFilters avec les filtres du filtre rapide sélectionné
      setTempSelectedFilters(item.filters)
    }
  }, [quickFilters, tempSelectedQuickFilter, tempSelectedFilters, mergeQuickFilterWithAdvancedFilters, onFiltersChange, isAdvancedFilters])

  const handleFilterChange = (newFilters: SelectedFiltersType) => {
    setTempSelectedFilters(newFilters)
  }

  const handleZoneSelect = useCallback((result: any) => {
    if (!result) {
      const newFilters = {
        ...tempSelectedFilters,
        zone: null,
      }
      setTempSelectedFilters(newFilters)
      onFiltersChange?.({ newFilters: newFilters, newQuickFilterId: tempSelectedQuickFilter })
      return
    }

    if (!result.id) {
      return
    }

    const newFilters = {
      ...tempSelectedFilters,
      zone: {
        uuid: result.id,
        name: result.metadata?.zone?.name || '',
        code: result.metadata?.zoneCode || '',
        type: result.metadata?.zoneType || 'custom'
      },
    }

    setTempSelectedFilters(newFilters)

    onFiltersChange?.({ newFilters: newFilters, newQuickFilterId: tempSelectedQuickFilter })
  }, [tempSelectedFilters, onFiltersChange, tempSelectedQuickFilter])

  const handleZoneAndCommitteeReset = useCallback(() => {
    const newFilters = { ...tempSelectedFilters }
    delete newFilters.zone
    delete newFilters.committee
    setTempSelectedFilters(newFilters)
    const apiFilters = { ...newFilters }
    delete apiFilters.zone
    delete apiFilters.committee
    onFiltersChange?.({ newFilters: apiFilters, newQuickFilterId: tempSelectedQuickFilter })
  }, [tempSelectedFilters, onFiltersChange, tempSelectedQuickFilter])

  const Header = useCallback(() => {
    return (
      <XStack justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="$gray1" padding="$medium">
        <Text.LG semibold>Destinataires</Text.LG>
        <XStack gap="$small">
          <VoxButton onPress={handleConfirmSelection} theme="blue" variant="soft" iconLeft={Save} size="sm">
            Terminé
          </VoxButton>
        </XStack>
      </XStack>
    )
  }, [handleConfirmSelection])

  return (
    <>
      <SF.Props themedText={false}>
        <SF
          theme="gray"
          size="lg"
          onPress={handleOpenModal}
          error={hasError}
          disabled={!messageId || !scope}
        >
          <SF.Container>
            <SF.Label>Destinataires</SF.Label>
            <SF.ValueContainer alignItems="flex-end">
              <SF.Text>
                {displayText}
              </SF.Text>
              {isFetchingMessageCountRecipients ? (
                <YStack marginBottom={2} marginHorizontal={2}>
                  <ActivityIndicator size={12} color="#6B7280" />
                </YStack>
              ) : (
                <SF.Text secondary fontSize={12}>{messageCountRecipients?.contacts}</SF.Text>
              )}
            </SF.ValueContainer>
          </SF.Container>
        </SF>
      </SF.Props>

      <ModalOrPageBase
        open={isModalOpen}
        onClose={handleCloseModal}
        header={
          <>
            <SafeAreaView style={{ height: Platform.OS === 'android' ? 20 : undefined }} />
            <Header />
          </>
        }
        withKeyboard={false}
      >
        <YStack w="100%" $gtMd={{ maxWidth: 480 }}>
          {media.gtMd ? (
            <Header />
          ) : null}
          <YStack gap="$medium" padding="$medium">
            <YStack gap="$medium">
              <YStack gap="$small">
                <XStack alignItems="center" flexWrap="wrap">
                  <Text.MD secondary>Votre publication sera notifiée à</Text.MD>
                  <XStack alignItems="center" justifyContent="center" position="relative" minWidth={18}>
                    {isFetchingMessageCountRecipients || isLoading ? (
                      <YStack position="absolute" left={0} top={0} right={0} bottom={0} justifyContent="center" alignItems="center" backgroundColor="white" zIndex={10}>
                        <ActivityIndicator size={14} color="#6B7280" />
                      </YStack>
                    ) : null}
                    <Text.MD primary semibold> {messageCountRecipients?.contacts} </Text.MD>
                  </XStack>
                  <Text.MD secondary>contacts.</Text.MD>
                </XStack>
                <XStack alignItems="center" flexWrap="wrap">
                  <Text.MD secondary>Elle sera visible à</Text.MD>
                  <XStack alignItems="center" justifyContent="center" position="relative" minWidth={18}>
                    {isFetchingMessageCountRecipients || isLoading ? (
                      <YStack position="absolute" left={0} top={0} right={0} bottom={0} justifyContent="center" alignItems="center" backgroundColor="white" zIndex={10}>
                        <ActivityIndicator size={14} color="#6B7280" />
                      </YStack>
                    ) : null}
                    <Text.MD primary semibold> {messageCountRecipients?.total} </Text.MD>
                  </XStack>
                  <Text.MD secondary>personnes.</Text.MD>
                </XStack>
              </YStack>
            </YStack>

            <YStack gap="$small" w="100%">
              <GlobalSearch
                provider={zoneProvider}
                onSelect={handleZoneSelect}
                onReset={handleZoneAndCommitteeReset}
                placeholder="Zone géographique"
                scope={scope}
                defaultValue={zoneDefaultValue}
                nullable={!!selectedFilters.committee && !!selectedFilters.zone}
                helpText={<Text.SM><Text.SM semibold>Toutes les zones inclues dans votre zone de gestion sont filtrables. </Text.SM> Exemple :  Circonscriptions, Cantons, Communauté de communes, Communes et Bureaux de vote.</Text.SM>}
              />
              <Text.SM secondary>Ciblez votre publication géographiquement (Circonscriptions, communes, etc.)</Text.SM>
            </YStack>
            <YStack gap="$small" marginVertical="$small">
              <XStack alignItems="center" gap="$xsmall" justifyContent="flex-end">
                <Text.MD color="$blue6" semibold onPress={() => setIsAdvancedFilters(!isAdvancedFilters)}>Filtres avancés</Text.MD>
                <XStack alignItems="center" gap="$small">
                  <SwitchV2
                    checked={isAdvancedFilters}
                    onPress={() => setIsAdvancedFilters(!isAdvancedFilters)}
                  />
                </XStack>
              </XStack>
            </YStack>
            {isAdvancedFilters ? (
              <AdvancedFilters
                scope={scope}
                selectedFilters={tempSelectedFilters}
                onFilterChange={(filterCode, value) => {
                  const newFilters = { ...tempSelectedFilters }
                  if (value === null) {
                    delete newFilters[filterCode]
                  } else {
                    newFilters[filterCode] = value
                  }
                  setTempSelectedFilters(newFilters)
                }}
              />
            ) : (
              <QuickFilter
                quickFilters={quickFilters}
                tempSelectedQuickFilter={tempSelectedQuickFilter}
                selectedQuickFilterId={selectedQuickFilterId}
                onItemSelection={handleItemSelection}
              />
            )}
          </YStack>
        </YStack>

      </ModalOrPageBase>
    </>
  )
}

export { getHierarchicalQuickFilters, getItemState, SelectedFiltersType, HierarchicalQuickFilterType }