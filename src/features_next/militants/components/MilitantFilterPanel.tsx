import React from 'react'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import FilterCollectionBuilder from '@/components/Filters/FilterCollectionBuilder'
import type { FilterValues } from '@/components/Filters/FilterCollectionBuilder'

interface MilitantFilterPanelProps {
  scope?: string
  initialValues?: FilterValues
  onChangeFilter: (values: FilterValues) => void
}

export function MilitantFilterPanel({ scope, initialValues, onChangeFilter }: MilitantFilterPanelProps) {
  return (
    <YStack padding="$medium" gap="$medium" mb={350}>
      <Text.LG semibold>Tous les filtres</Text.LG>
      <FilterCollectionBuilder featureKey="publications" scope={scope} initialValues={initialValues} onChangeFilter={onChangeFilter} />
    </YStack>
  )
}
