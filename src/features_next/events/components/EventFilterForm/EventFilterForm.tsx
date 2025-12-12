import React, { memo, RefObject, useCallback, useMemo } from 'react'
import { TextInput } from 'react-native'
import AssemblySelect from '@/components/AssemblySelect/AssemblySelect'
import SearchBox from '@/components/Search/SearchBox'
import { eventFiltersState } from '@/features_next/events/store/filterStore'
import { useMedia, View, YStack } from 'tamagui'

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
  const media = useMedia()
  const { value, setValue, searchInputRef } = eventFiltersState()

  const handleAssemblyChange = useCallback((x?: { value: string; label: string }) => {
    setValue((y) => ({ ...y, zone: x?.value, detailZone: x }))
  }, [])

  const handleSearchChange = useCallback((x: string) => {
    setValue((y) => ({ ...y, search: x }))
  }, [])

  const gap = useMemo(() => media.lg ? 8 : 16, [media])
  const flexDirection = useMemo(() => media.md ? 'row' : 'column', [media])

  return (
    <View flexDirection={flexDirection} gap={gap}>
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
    </View>
  )
}
const MemoizedEF = React.memo(EventFilters)

MemoizedEF.displayName = 'EventFilters'

export default MemoizedEF
