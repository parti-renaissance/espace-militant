import React from 'react'
import { Image, YStack } from 'tamagui'
import { RotateCw } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import { PublicationsFilters } from '../index'

import EmptyStateIllustration from '../../../assets/empty-publication.png'

interface EmptyStateWithFiltersProps {
  filters: PublicationsFilters
  onResetFilters: () => void
}

export default function EmptyStateWithFilters({ filters, onResetFilters }: EmptyStateWithFiltersProps) {
  const getFilterLabel = () => {
    if (filters.status === 'draft') {
      return 'brouillons'
    }
    if (filters.status === 'sent') {
      return 'publiées'
    }
    return ''
  }

  const filterLabel = getFilterLabel()

  return (
    <YStack alignItems="center" justifyContent="center" flex={1} gap={32} py={42} px={16}>
      <Image source={EmptyStateIllustration} width={178} height={189} objectFit="contain" />
      <YStack gap={24}>
        <Text.MD semibold secondary textAlign="center" textWrap="balance">
          {filterLabel ? `Aucune publication "${filterLabel}" trouvée` : 'Aucune publication trouvée'}
        </Text.MD>
        <Text.MD secondary textAlign="center" textWrap="balance">
          Aucune publication ne correspond à vos filtres actifs.
        </Text.MD>
      </YStack>
      <YStack>
        <VoxButton variant="outlined" theme="purple" iconLeft={RotateCw} onPress={onResetFilters}>
          Réinitialiser les filtres
        </VoxButton>
      </YStack>
    </YStack>
  )
}
