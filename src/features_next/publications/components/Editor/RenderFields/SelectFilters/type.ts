export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | { min: number | null; max: number | null }
  | { start: string | null; end: string | null }
  | Record<string, string>
  | Record<string, string>[]
  | { uuid: string; type: string; code: string; name: string }
  | { uuid: string; type: string; code: string; name: string }[]
  | undefined
  | null

export type SelectedFiltersType = Record<string, FilterValue>

export type HierarchicalQuickFilterType = {
  value: string
  label: string
  type: 'radio'
  level: number
  parentId: string | null
  count?: number
  filters: SelectedFiltersType
}
