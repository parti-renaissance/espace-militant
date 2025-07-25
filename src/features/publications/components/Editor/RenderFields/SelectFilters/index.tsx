import React, { useMemo, useState, useCallback } from 'react'
import { XStack, YStack, useMedia } from 'tamagui'
import { ActivityIndicator, SafeAreaView } from 'react-native'
import { Save } from '@tamagui/lucide-icons'
import { VoxButton } from '@/components/Button'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import Text from '@/components/base/Text'
import { SelectFrames as SF } from '@/components/base/Select/Frames'
import SelectFiltersItem from './SelectFiltersItem'
import { AlertUtils } from '@/screens/shared/AlertUtils'
import { useGetMessageCountRecipients } from '@/services/publications/hook';
import { getHierarchicalQuickFilters, getItemState } from './helpers';
import { SelectedFiltersType, HierarchicalQuickFilterType } from './type';

interface SelectFiltersProps {
  onFiltersChange?: ({ newFilters, newQuickFilterId }: { newFilters: SelectedFiltersType, newQuickFilterId: string | null }) => void
  selectedFilters?: SelectedFiltersType
  selectedQuickFilterId?: string | null
  messageId?: string
  scope?: string
  isLoading?: boolean
}

export default function SelectFilters({
  onFiltersChange,
  selectedFilters = {},
  selectedQuickFilterId = null,
  messageId,
  scope,
  isLoading = false
}: SelectFiltersProps) {
  const media = useMedia()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedQuickFilter, setTempSelectedQuickFilter] = useState<string | null>(selectedQuickFilterId || null)
  const [tempSelectedFilters, setTempSelectedFilters] = useState<SelectedFiltersType>(selectedFilters)
  const quickFilters: HierarchicalQuickFilterType[] = useMemo(() => getHierarchicalQuickFilters(), [])

  const { data: messageCountRecipients, isFetching: isFetchingMessageCountRecipients } = useGetMessageCountRecipients({ messageId: messageId, scope: scope })

  const handleOpenModal = () => {
    const quickFilterToUse = selectedQuickFilterId || (() => {
      const matchingQuickFilter = quickFilters.find(qf =>
        JSON.stringify(qf.filters) === JSON.stringify(selectedFilters)
      )
      return matchingQuickFilter?.value || 'adherents'
    })()

    setTempSelectedQuickFilter(quickFilterToUse)
    setTempSelectedFilters(selectedFilters)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleConfirmSelection = () => {
    if (tempSelectedQuickFilter) {
      const selectedQuickFilter = quickFilters.find(qf => qf.value === tempSelectedQuickFilter)
      if (selectedQuickFilter) {
        onFiltersChange?.({ newFilters: selectedQuickFilter.filters, newQuickFilterId: tempSelectedQuickFilter })
      }
    } else {
      onFiltersChange?.({ newFilters: tempSelectedFilters, newQuickFilterId: null })
    }
    handleCloseModal()
  }

  const handleItemSelection = (itemId: string, immediateChange: boolean = false) => {
    const item = quickFilters.find(d => d.value === itemId)
    if (!item) return
    if (tempSelectedQuickFilter === itemId) return

    setTempSelectedQuickFilter(itemId)

    if (immediateChange) {
      onFiltersChange?.({ newFilters: item.filters, newQuickFilterId: itemId })
    }
  }

  const handleFilterChange = (newFilters: SelectedFiltersType) => {
    setTempSelectedFilters(newFilters)
  }

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
          error={false}
          disabled={!messageId || !scope}
        >
          <SF.Container>
            <SF.Label>Destinataires</SF.Label>
            <SF.ValueContainer alignItems="flex-end">
              <SF.Text>
                {selectedQuickFilterId
                  ? (() => {
                    const item = quickFilters.find(d => d.value === selectedQuickFilterId)
                    return item ? item.label : 'Sélectionné'
                  })()
                  : (() => {
                    const nonNullFilters = Object.entries(selectedFilters).filter(([_, value]) => value !== null && value !== undefined)
                    return nonNullFilters.length > 0
                      ? `${nonNullFilters.length} filtre${nonNullFilters.length > 1 ? 's' : ''} avancé${nonNullFilters.length > 1 ? 's' : ''}`
                      : 'Sélectionner'
                  })()
                }
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
            <SafeAreaView />
            <Header />
          </>
        }
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
                  <Text.MD secondary>Il sera visible à</Text.MD>
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
              <SF.Props themedText={false}>
                <SF
                  theme="gray"
                  size="lg"
                  onPress={() => {
                    AlertUtils.showSimpleAlert('En cours de développement', 'Prochainement, vous pourrez sélectionner des zones comme des circonscriptions, des communes, etc...', 'Retour', 'OK', () => { })
                  }}
                  error={false}
                  disabled={false}
                >
                  <SF.Container>
                    <SF.Label>Zone géographique</SF.Label>
                    <SF.ValueContainer>
                      <SF.Text>
                        {selectedFilters.zones?.[0]?.name ? selectedFilters.zones[0].name : 'Votre zone géographique'}
                      </SF.Text>
                    </SF.ValueContainer>
                  </SF.Container>
                </SF>
              </SF.Props>
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