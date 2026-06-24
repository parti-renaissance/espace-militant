import React from 'react'
import { TextInput } from 'react-native'
import { create } from 'zustand'

export type HubItemTypeFilter = 'all' | 'event' | 'action'

export type EventFilters = {
  zone: string | undefined
  detailZone: { value: string; label: string } | undefined
  search: string
  itemType: HubItemTypeFilter
}

export type FiltersState = {
  searchInputRef: React.RefObject<TextInput | null>
  value: EventFilters
  setValue: (value: EventFilters | ((value: EventFilters) => EventFilters)) => void
}

export const defaultEventFilters: EventFilters = {
  search: '',
  detailZone: undefined,
  zone: undefined,
  itemType: 'all',
}

export const eventFiltersState = create<FiltersState>((set) => ({
  searchInputRef: React.createRef(),
  value: defaultEventFilters,
  setValue: (x) => (typeof x === 'function' ? set((y) => ({ ...y, value: x(y.value) })) : set((y) => ({ ...y, value: x }))),
}))
