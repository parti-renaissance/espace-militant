import React, { useCallback } from 'react'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import FilterCollectionBuilder from '@/components/Filters/FilterCollectionBuilder'
import type { FilterValues } from '@/components/Filters/FilterCollectionBuilder'

interface MilitantFilterPanelProps {
  scope?: string
}

export function MilitantFilterPanel({ scope }: MilitantFilterPanelProps) {
  const handleChangeFilter = useCallback((values: FilterValues) => {
    // eslint-disable-next-line no-console
    console.log('FilterCollectionBuilder onChangeFilter', values)
  }, [])

  return (
    <YStack padding="$medium" gap="$medium" mb={350}>
      <Text.LG semibold>Tous les filtres</Text.LG>
      <FilterCollectionBuilder featureKey="contacts" scope={scope} onChangeFilter={handleChangeFilter} />
    </YStack>
  )
}
