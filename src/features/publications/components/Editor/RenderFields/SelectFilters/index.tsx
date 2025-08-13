import React, { useMemo, useState, useCallback } from 'react'
import { XStack, YStack, useMedia } from 'tamagui'
import { ActivityIndicator, Platform, SafeAreaView } from 'react-native'
import { Save } from '@tamagui/lucide-icons'
import { VoxButton } from '@/components/Button'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import Text from '@/components/base/Text'
import { SelectFrames as SF } from '@/components/base/Select/Frames'
import SelectFiltersItem from './SelectFiltersItem'
import { useGetMessageCountRecipientsPartial } from '@/services/publications/hook';
import { getHierarchicalQuickFilters, getItemState } from './helpers';
import { SelectedFiltersType, HierarchicalQuickFilterType } from './type';
import { useQueryClient } from '@tanstack/react-query'
import { GlobalSearch, ZoneProvider } from '@/components/GlobalSearch'

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
  const quickFilters: HierarchicalQuickFilterType[] = useMemo(() => getHierarchicalQuickFilters(), [])
  const queryClient = useQueryClient();

  const zoneProvider = useMemo(() => new ZoneProvider(), [])

  // Optimisation : Calcul du defaultValue de la zone avec useMemo
  const zoneDefaultValue = useMemo(() => {
    // Vérifier d'abord si une zone est sélectionnée
    if (selectedFilters.zone && typeof selectedFilters.zone === 'object' && 'name' in selectedFilters.zone && 'code' in selectedFilters.zone) {
      return `${selectedFilters.zone.name} (${selectedFilters.zone.code})`
    }
    
    // Vérifier s'il y a des zones de fallback
    if (selectedFilters.zones && Array.isArray(selectedFilters.zones) && selectedFilters.zones.length > 0) {
      const firstZone = selectedFilters.zones[0]
      if (firstZone && typeof firstZone === 'object' && 'name' in firstZone && 'code' in firstZone) {
        return `${firstZone.name} (${firstZone.code})`
      }
    }
    
    // Vérifier s'il y a un committee (priorité sur les zones)
    if (selectedFilters.committee && typeof selectedFilters.committee === 'object' && 'name' in selectedFilters.committee) {
      return selectedFilters.committee.name
    }
    
    // Aucune zone ni committee trouvé
    return undefined
  }, [selectedFilters.zone, selectedFilters.zones, selectedFilters.committee])

  // Optimisation : Calcul du texte d'affichage avec useMemo
  const displayText = useMemo(() => {
    if (selectedQuickFilterId) {
      const item = quickFilters.find(d => d.value === selectedQuickFilterId)
      return item ? item.label : 'Sélectionné'
    }
    
    const nonNullFilters = Object.entries(selectedFilters).filter(([_, value]) => value !== null && value !== undefined)
    return nonNullFilters.length > 0
      ? `${nonNullFilters.length} filtre${nonNullFilters.length > 1 ? 's' : ''} avancé${nonNullFilters.length > 1 ? 's' : ''}`
      : 'Sélectionner'
  }, [selectedQuickFilterId, quickFilters, selectedFilters])

  const { data: messageCountRecipients, isFetching: isFetchingMessageCountRecipients } = useGetMessageCountRecipientsPartial({ messageId: messageId, scope: scope })

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
        onFiltersChange?.({ newFilters: selectedQuickFilter.filters, newQuickFilterId: tempSelectedQuickFilter })
      }
    } else {
      onFiltersChange?.({ newFilters: tempSelectedFilters, newQuickFilterId: null })
    }
    queryClient.invalidateQueries({
      queryKey: ['message-count-recipients', messageId],
    })
    handleCloseModal()
  }, [tempSelectedQuickFilter, quickFilters, tempSelectedFilters, onFiltersChange, queryClient, messageId, handleCloseModal])

  const handleItemSelection = useCallback((itemId: string, immediateChange: boolean = false) => {
    const item = quickFilters.find(d => d.value === itemId)
    if (!item) return
    if (tempSelectedQuickFilter === itemId) return

    setTempSelectedQuickFilter(itemId)

    if (immediateChange) {
      onFiltersChange?.({ newFilters: item.filters, newQuickFilterId: itemId })
    }
  }, [quickFilters, tempSelectedQuickFilter, onFiltersChange])

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

  const handleZoneReset = useCallback(() => {
    const newFilters = { ...tempSelectedFilters }
    delete newFilters.zone
    setTempSelectedFilters(newFilters)
    const apiFilters = { ...newFilters }
    delete apiFilters.zone
    onFiltersChange?.({ newFilters: apiFilters, newQuickFilterId: tempSelectedQuickFilter })
  }, [tempSelectedFilters, onFiltersChange, tempSelectedQuickFilter])

  // Handler pour réinitialiser les zones ET les committees
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
              />
              <Text.SM secondary>Ciblez votre publication géographiquement (Circonscriptions, communes, etc.)</Text.SM>
            </YStack>
            <YStack gap="$small">

            </YStack>
            <XStack alignItems="center" gap="$small">
              <Text.MD secondary>Filtres militants</Text.MD>
              <YStack h={1} flexGrow={1} mt={2} bg="$textOutline" />
            </XStack>
            <YStack gap="$small">
              {quickFilters.map((item) => {
                const state = getItemState(item.value, tempSelectedQuickFilter, quickFilters)
                return (
                  <SelectFiltersItem
                    key={item.value}
                    label={item.label}
                    count={item.count}
                    state={state}
                    onPress={() => handleItemSelection(item.value, !!selectedQuickFilterId)}
                    type={item.type}
                  />
                )
              })}
            </YStack>
          </YStack>
        </YStack>

      </ModalOrPageBase>
    </>
  )
}

export { getHierarchicalQuickFilters, getItemState, SelectedFiltersType, HierarchicalQuickFilterType }