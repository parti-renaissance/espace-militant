import { RestGetGeneralConventionResponse } from '@/services/general-convention/schema'
import { create } from 'zustand'

export type Filter = {
  search: string
  assembly: string
}

type State = {
  selectedData: RestGetGeneralConventionResponse | null
  filter: Filter
  setSelectedData: (data: RestGetGeneralConventionResponse) => void
  setFilter: (data: Filter) => void
}

export const useDataStore = create<State>((set) => ({
  selectedData: null,
  filter: {
    search: '',
    assembly: 'all',
  },
  setSelectedData: (data) => set({ selectedData: data }),
  setFilter: (data) => set({ filter: data }),
}))
