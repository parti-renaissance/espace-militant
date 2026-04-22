export type ScopeTargetEntry = {
  role: string
  include_role: boolean
  include_team: boolean
  team_roles: string[]
}
export type ScopeTargetValue = ScopeTargetEntry[]

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | { min: number | null; max: number | null }
  | { start: number | null; end: number | null }
  | { start: string | null; end: string | null }
  | Record<string, string>
  | Record<string, string>[]
  | { uuid: string; type: string; code: string; name: string }
  | { uuid: string; type: string; code: string; name: string }[]
  | ScopeTargetValue
  | undefined
  | null

export type SelectedFiltersType = Record<string, FilterValue>

/** Détecte si une valeur est un objet d'intervalle (structure { start?, end? }) */
export const isIntervalObject = (v: unknown): v is { start?: unknown; end?: unknown } =>
  v != null && typeof v === 'object' && ('start' in v || 'end' in v)

/** Vérifie si un intervalle est vide (start et end sont null/vides) */
export const isEmptyInterval = (v: unknown): boolean => {
  if (!isIntervalObject(v)) return true
  const startEmpty = v.start == null || v.start === ''
  const endEmpty = v.end == null || v.end === ''
  return startEmpty && endEmpty
}

/** Indique si une valeur de filtre est considérée comme "remplie" (non vide) */
export const isFilterValueFilled = (v: unknown): boolean => {
  if (v == null || v === '') return false
  if (Array.isArray(v)) return v.length > 0
  if (isIntervalObject(v)) return !isEmptyInterval(v)
  return true
}

export type HierarchicalQuickFilterType = {
  value: string
  label: string
  type: 'radio'
  level: number
  parentId: string | null
  count?: number
  filters: SelectedFiltersType
}
