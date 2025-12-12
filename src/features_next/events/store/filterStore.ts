import React from 'react'
import { TextInput } from 'react-native'
import { create } from 'zustand'

export type EventFilters = {
  zone: string | undefined
  detailZone: { value: string; label: string } | undefined
  search: string
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
}

export const eventFiltersState = create<FiltersState>((set) => ({
  searchInputRef: React.createRef(),
  value: defaultEventFilters,
  setValue: (x) => (typeof x === 'function' ? set((y) => ({ ...x, value: x(y.value) })) : set({ value: x })),
}))
