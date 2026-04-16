import React, { ReactNode } from 'react'
import { Image } from 'expo-image'
import { YStack } from 'tamagui'
import { RotateCcw } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import EmptyStateImage from '@/assets/illustrations/empty-list.png'

const DEFAULT_TITLE = 'Aucun résultat trouvé'

export interface EmptyStateWithFiltersProps {
  title?: string
  subtitle?: string
  onResetFilters?: () => void
  illustration?: ReactNode
}

export default function EmptyStateWithFilters({
  title = DEFAULT_TITLE,
  subtitle,
  onResetFilters,
  illustration = <Image source={EmptyStateImage} style={{ width: 178, height: 189 }} contentFit="contain" />,
}: EmptyStateWithFiltersProps) {
  return (
    <YStack alignItems="center" justifyContent="center" flex={1} gap={32} py={42} px={16}>
      {illustration}
      <YStack gap={24}>
        <Text.MD semibold secondary textAlign="center" textWrap="balance">
          {title}
        </Text.MD>
        {subtitle && (
          <Text.MD secondary textAlign="center" textWrap="balance">
            {subtitle}
          </Text.MD>
        )}
      </YStack>
      {onResetFilters && (
        <YStack>
          <VoxButton variant="outlined" theme="purple" iconLeft={RotateCcw} onPress={onResetFilters}>
            Réinitialiser les filtres
          </VoxButton>
        </YStack>
      )}
    </YStack>
  )
}
