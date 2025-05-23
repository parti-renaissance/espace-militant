import React, { memo, RefObject, useCallback } from 'react'
import { TextInput } from 'react-native'
import AssemblySelect from '@/components/AssemblySelect/AssemblySelect'
import SearchBox from '@/components/Search/SearchBox'
import { eventFiltersState } from '@/features/events/store/filterStore'
import { YStack } from 'tamagui'

type EventFiltersProps = {
  onSearchFocus?: () => void
}

type AssemblySelectWrapperProps = {
  zone?: string
  defaultAssembly?: string
  onDetailChange: (x?: { value: string; label: string }) => void
}

const AssemblySelectWrapper = memo(({ zone, defaultAssembly, onDetailChange }: AssemblySelectWrapperProps) => {
  return (
    <YStack flex={2}>
      <AssemblySelect
        resetable={zone !== undefined && zone !== defaultAssembly}
        defaultValue={defaultAssembly}
        size="sm"
        id="filter-dept"
        color="white"
        value={zone}
        onDetailChange={onDetailChange}
      />
    </YStack>
  )
})

AssemblySelectWrapper.displayName = 'AssemblySelectWrapper'

const EventFilters = ({ onSearchFocus }: EventFiltersProps) => {
  const { value, setValue, searchInputRef } = eventFiltersState()

  const handleAssemblyChange = useCallback((x?: { value: string; label: string }) => {
    setValue((y) => ({ ...y, zone: x?.value, detailZone: x }))
  }, [])

  const handleSearchChange = useCallback((x: string) => {
    setValue((y) => ({ ...y, search: x }))
  }, [])

  return (
    <YStack gap="$medium" $lg={{ flexDirection: 'row', gap: '$small' }}>
      <AssemblySelectWrapper zone={value.zone} onDetailChange={handleAssemblyChange} />
      <YStack flex={1}>
        <SearchBox
          label={value.detailZone ? `Dans ${value.detailZone.label}` : undefined}
          enterKeyHint="done"
          value={value.search}
          ref={searchInputRef as RefObject<TextInput>}
          onChange={handleSearchChange}
          onFocus={onSearchFocus}
        />
      </YStack>
    </YStack>
  )
}
const MemoizedEF = React.memo(EventFilters)

MemoizedEF.displayName = 'EventFilters'

export default MemoizedEF
