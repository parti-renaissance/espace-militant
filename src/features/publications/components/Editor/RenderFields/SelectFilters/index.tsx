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
import { SelectedFiltersType, HierarchicalQuickFilterType, FilterValue } from './type';
import { useQueryClient } from '@tanstack/react-query'
import { GlobalSearch, ZoneProvider } from '@/components/GlobalSearch'
import SwitchV2 from '@/components/base/SwitchV2/SwitchV2'
import SelectQuickFiltersItem from './QuickFilter/SelectQuickFiltersItem'

interface SelectFiltersProps {
  updateFilter: (updatedFilter: { [code: string]: FilterValue }) => void
  selectedFilters?: SelectedFiltersType
  selectedQuickFilterId?: string | null
  messageId?: string
  scope?: string
  isLoading?: boolean
  hasError?: boolean
}

export default function SelectFilters({
  updateFilter,
  selectedFilters = {},
  selectedQuickFilterId = null,
  messageId,
  scope,
  isLoading = false,
  hasError = false
}: SelectFiltersProps) {
  const media = useMedia()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdvancedFilters, setIsAdvancedFilters] = useState(false)
  const quickFilters: HierarchicalQuickFilterType[] = useMemo(() => getHierarchicalQuickFilters(), [])
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsAdvancedFilters(selectedQuickFilterId ? false : true)
  }, [])

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
      
      // Protéger static_tags si sa valeur est liée à la rentrée
      if (currentFilters.static_tags === 'national_event:rentree-2025' || currentFilters.static_tags === '!national_event:rentree-2025') {
        protectedFilters.push('static_tags')
      }
      
      protectedFilters.forEach(filterKey => {
        if (currentFilters[filterKey] !== null && currentFilters[filterKey] !== undefined) {
          mergedFilters[filterKey] = currentFilters[filterKey]
        }
      })

      // On réinitialise les autres filtres avancés
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
      let baseLabel = item ? item.label : 'Sélectionné'
      
      // Check if static_tags contains rentree-2025 to add rentrée information
      if (selectedFilters.static_tags) {
        const staticTagsValue = selectedFilters.static_tags
        if (staticTagsValue === 'national_event:rentree-2025') {
          baseLabel += ' - Inscrits à la rentrée'
        } else if (staticTagsValue === '!national_event:rentree-2025') {
          baseLabel += ' - Non-inscrits à la rentrée'
        }
      }
      
      return baseLabel
    }

    const excludedFilters = ['zone', 'zones', 'committee']
    
    // Exclure static_tags s'il est protégé (lié à la rentrée)
    if (selectedFilters.static_tags === 'national_event:rentree-2025' || selectedFilters.static_tags === '!national_event:rentree-2025') {
      excludedFilters.push('static_tags')
    }
    
    const nonNullFilters = Object.entries(selectedFilters).filter(([key, value]) =>
      value !== null && value !== undefined && !excludedFilters.includes(key)
    )
    return nonNullFilters.length > 0
      ? `${nonNullFilters.length} filtre${nonNullFilters.length > 1 ? 's' : ''} avancé${nonNullFilters.length > 1 ? 's' : ''}`
      : 'Sélectionner'
  }, [selectedQuickFilterId, quickFilters, selectedFilters, isAdvancedFilters])

  const { data: messageCountRecipients, isFetching: isFetchingMessageCountRecipients } = useGetMessageCountRecipientsPartial({ messageId: messageId, scope: scope })

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
    setIsAdvancedFilters(selectedQuickFilterId ? false : true)
  }, [selectedQuickFilterId])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    queryClient.refetchQueries({
      queryKey: ['message-count-recipients', messageId],
    })
  }, [])

  const handleQuickFilterSelection = useCallback((itemId: string) => {
    const item = quickFilters.find(d => d.value === itemId)
    if (!item) return

    const mergedFilters = mergeQuickFilterWithAdvancedFilters(item, selectedFilters, isAdvancedFilters)

    // Appliquer tous les filtres fusionnés en une seule fois
    updateFilter(mergedFilters)
  }, [quickFilters, selectedFilters, mergeQuickFilterWithAdvancedFilters, updateFilter, isAdvancedFilters])

  const handleAdvancedFilterChange = useCallback((filterCode: string, value: any) => {
    updateFilter({ [filterCode]: value })
  }, [updateFilter])

  const handleZoneSelect = useCallback((result: any) => {
    if (!result) {
      updateFilter({ zone: null })
    } else if (result.id) {
      updateFilter({
        zone: {
          uuid: result.id,
          name: result.metadata?.zone?.name || '',
          code: result.metadata?.zoneCode || '',
          type: result.metadata?.zoneType || 'custom'
        }
      })
    }
  }, [updateFilter])

  const handleZoneAndCommitteeReset = useCallback(() => {
    updateFilter({ zone: null, committee: null })
  }, [updateFilter])

  const handleAdvancedFiltersToggle = useCallback(() => {
    setIsAdvancedFilters(!isAdvancedFilters)
  }, [isAdvancedFilters])

  const Header = useCallback(() => {
    return (
      <XStack justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="$gray1" padding="$medium">
        <Text.LG semibold>Destinataires</Text.LG>
        <XStack gap="$small">
          <VoxButton onPress={handleCloseModal} theme="blue" variant="soft" iconLeft={Save} size="sm">
            Terminé
          </VoxButton>
        </XStack>
      </XStack>
    )
  }, [handleCloseModal])

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
        <YStack w="100%" maxWidth={media.gtMd ? 480 : undefined}>
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
                <Text.MD color="$blue6" semibold onPress={handleAdvancedFiltersToggle}>Filtres avancés</Text.MD>
                <XStack alignItems="center" gap="$small">
                  <SwitchV2
                    checked={isAdvancedFilters}
                    onPress={handleAdvancedFiltersToggle}
                  />
                </XStack>
              </XStack>
            </YStack>
            {isAdvancedFilters ? (
              <AdvancedFilters
                scope={scope}
                selectedFilters={selectedFilters}
                onFilterChange={handleAdvancedFilterChange}
              />
            ) : (
              <>
                <QuickFilter
                  quickFilters={quickFilters}
                  selectedQuickFilterId={selectedQuickFilterId}
                  onItemSelection={handleQuickFilterSelection}
                />
                <XStack alignItems="center" gap="$small">
                  <Text.MD secondary>Filtres circonstanciels</Text.MD>
                  <YStack h={1} flexGrow={1} mt={2} bg="$textOutline" />
                </XStack>
                <YStack gap="$small">
                  <SelectQuickFiltersItem
                    label="Inscrits à la rentrée"
                    state={selectedFilters.static_tags === "national_event:rentree-2025" ? "selected" : "default"}
                    onPress={() => {
                      if (selectedFilters.static_tags === "national_event:rentree-2025") {
                        handleAdvancedFilterChange("static_tags", null)
                      } else {
                        handleAdvancedFilterChange("static_tags", "national_event:rentree-2025")
                      }
                    }}
                    type="radio"
                  />
                  <SelectQuickFiltersItem
                    label="Non-inscrits à la rentrée"
                    state={selectedFilters.static_tags === "!national_event:rentree-2025" ? "selected" : "default"}
                    onPress={() => {
                      if (selectedFilters.static_tags === "!national_event:rentree-2025") {
                        handleAdvancedFilterChange("static_tags", null)
                      } else {
                        handleAdvancedFilterChange("static_tags", "!national_event:rentree-2025")
                      }
                    }}
                    type="radio"
                  />
                </YStack>
              </>

            )}
          </YStack>
        </YStack>

      </ModalOrPageBase>
    </>
  )
}

export { getHierarchicalQuickFilters, getItemState, SelectedFiltersType, HierarchicalQuickFilterType }