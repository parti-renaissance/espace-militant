import React from 'react'
import { useMedia, View, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight, Filter } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

interface MilitantHeaderPaginationProps {
  isPrevDisabled: boolean
  isNextDisabled: boolean
  handlePrevPage: () => void
  handleNextPage: () => void
  pageStart?: number
  pageEnd?: number
  total?: number
}

export interface MilitantListHeaderProps {
  /** Désactive les boutons de pagination (ex: skeleton) */
  paginationDisabled?: boolean
  isPrevDisabled?: boolean
  isNextDisabled?: boolean
  handlePrevPage?: () => void
  handleNextPage?: () => void
  pageStart?: number
  pageEnd?: number
  total?: number
  onFilterPress: () => void
}

export function MilitantHeaderTop() {
  const media = useMedia()

  if (media.sm) {
    return null
  }

  return (
    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$medium">
      <YStack flex={1} gap="$small">
        <Text.LG semibold>Mes militants</Text.LG>
        <Text.SM secondary>Consultez et gérez les militants de votre périmètre</Text.SM>
      </YStack>
    </XStack>
  )
}

function MilitantHeaderPagination({
  isPrevDisabled,
  isNextDisabled,
  handlePrevPage,
  handleNextPage,
  pageStart,
  pageEnd,
  total,
}: MilitantHeaderPaginationProps) {
  const media = useMedia()
  const rangeText = pageStart != null && pageEnd != null ? `${pageStart}-${pageEnd}` : '1-1'

  return (
    <XStack justifyContent={media.sm ? 'space-between' : 'flex-end'} alignItems="center" gap="$medium">
      <Text.SM>
        <Text.SM secondary>{rangeText ?? '1 - 25'} sur </Text.SM>
        <Text.SM semibold>{total ?? '25'}</Text.SM>
      </Text.SM>
      <XStack gap={4}>
        <VoxButton
          variant="outlined"
          theme="gray"
          size="md"
          shrink
          iconLeft={ChevronLeft}
          onPress={handlePrevPage}
          disabled={isPrevDisabled}
          opacity={isPrevDisabled ? 0.5 : 1}
        >
          Précédent
        </VoxButton>
        <VoxButton
          variant="outlined"
          theme="gray"
          size="md"
          shrink
          iconRight={ChevronRight}
          onPress={handleNextPage}
          disabled={isNextDisabled}
          opacity={isNextDisabled ? 0.5 : 1}
        >
          Suivant
        </VoxButton>
      </XStack>
    </XStack>
  )
}

export function MilitantListHeader({
  paginationDisabled = false,
  isPrevDisabled = true,
  isNextDisabled = true,
  handlePrevPage = () => {},
  handleNextPage = () => {},
  pageStart,
  pageEnd,
  total,
  onFilterPress,
}: MilitantListHeaderProps) {
  const media = useMedia()
  const prevDisabled = paginationDisabled || isPrevDisabled
  const nextDisabled = paginationDisabled || isNextDisabled
  const onPrev = paginationDisabled ? () => {} : handlePrevPage
  const onNext = paginationDisabled ? () => {} : handleNextPage

  return (
    <YStack>
      <MilitantHeaderTop />
      <View flexDirection={media.sm ? 'column' : 'row'} justifyContent="space-between" gap="$small" mt="$medium" mx={media.sm ? '$medium' : undefined}>
        <VoxButton variant="outlined" theme="gray" size="md" iconLeft={Filter} onPress={onFilterPress}>
          Filtrer
        </VoxButton>

        <MilitantHeaderPagination
          isPrevDisabled={prevDisabled}
          isNextDisabled={nextDisabled}
          handlePrevPage={onPrev}
          handleNextPage={onNext}
          pageStart={pageStart}
          pageEnd={pageEnd}
          total={total}
        />
      </View>
    </YStack>
  )
}
