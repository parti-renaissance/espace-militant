import type {
  FilterDefinition,
  FilterOptionSelect,
  FiltersCollectionResponse,
} from '@/services/filters-collection/schema'

import type { FilterValue, FilterValues } from './FilterCollectionBuilder'

export function isFilterValueActive(value: FilterValue): boolean {
  if (value === undefined || value === null) return false
  if (value === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  if (typeof value === 'object' && value !== null && 'start' in value && 'end' in value) {
    const interval = value as { start: unknown; end: unknown }
    if (interval.start == null && interval.end == null) return false
  }
  return true
}

export function hasActiveFilters(filters: FilterValues): boolean {
  return Object.values(filters).some(isFilterValueActive)
}

export interface ActiveFilterChip {
  key: string
  label: string
  value_label: string
}

export function getActiveFilterChips(
  filters: FilterValues,
  collection: FiltersCollectionResponse | undefined,
): ActiveFilterChip[] {
  if (!collection?.length) return []

  const byCode = new Map<string, FilterDefinition>()
  for (const group of collection) {
    for (const filter of group.filters) {
      byCode.set(filter.code, filter)
    }
  }

  const chips: ActiveFilterChip[] = []
  for (const [code, value] of Object.entries(filters)) {
    if (!isFilterValueActive(value)) continue
    const definition = byCode.get(code)
    const label = definition?.label ?? code
    const value_label = formatFilterValueLabel(value, definition)
    chips.push({ key: code, label, value_label })
  }
  return chips
}

function formatFilterValueLabel(value: FilterValue, definition: FilterDefinition | undefined): string {
  if (value === undefined || value === null) return ''

  if (typeof value === 'string') {
    if (definition?.type === 'select' && definition?.options && 'choices' in definition.options) {
      const choices = (definition.options as FilterOptionSelect).choices as Record<string, string> | undefined
      return (choices && choices[value]) ?? value
    }
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return ''
    const first = value[0]
    if (typeof first === 'string') {
      if (definition?.type === 'select' && definition?.options && 'choices' in definition.options) {
        const choices = (definition.options as FilterOptionSelect).choices as Record<string, string> | undefined
        return value.map((v) => (choices && choices[v]) ?? v).join(', ')
      }
      return value.join(', ')
    }
    if (first != null && typeof first === 'object' && 'name' in first) {
      return value.map((z) => (z as { name?: string; code?: string }).name ?? (z as { code?: string }).code ?? '').join(', ')
    }
    return value.join(', ')
  }

  if (typeof value === 'object' && value !== null) {
    if ('start' in value && 'end' in value) {
      const interval = value as { start: number | string | null; end: number | string | null }
      const s = interval.start
      const e = interval.end
      if (s != null && e != null) return `${s} - ${e}`
      if (s != null) return `≥ ${s}`
      if (e != null) return `≤ ${e}`
    }
    if ('uuid' in value && ('name' in value || 'code' in value)) {
      const z = value as { name?: string; code?: string }
      if (z.name && z.code) return `${z.name} (${z.code})`
      return z.name ?? z.code ?? ''
    }
  }

  return String(value)
}
