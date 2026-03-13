import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import { Spinner, XStack, YStack } from 'tamagui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'

import DateInput from '@/components/base/DateInput'
import Input from '@/components/base/Input/Input'
import SelectV3 from '@/components/base/Select/SelectV3'
import Text from '@/components/base/Text'
import { GlobalSearch } from '@/components/GlobalSearch'
import { ZoneProvider } from '@/components/GlobalSearch/providers/ZoneProvider'
import type { ZoneProviderOptions } from '@/components/GlobalSearch/providers/ZoneProvider'
import type { SearchProvider, SearchResult } from '@/components/GlobalSearch/types'
import DateInterval, { type DateIntervalValue } from '@/features_next/publications/components/Editor/RenderFields/SelectFilters/AdvancedFilters/DateInterval'

import { useGetFiltersCollection } from '@/services/filters-collection/hook'
import type {
  FilterDefinition,
  FilterGroup,
  FilterOptionIntegerInterval,
  FilterOptionSelect,
  FilterOptionZoneAutocomplete,
  FiltersCollectionResponse,
} from '@/services/filters-collection/schema'

import IntegerInterval, { type IntegerIntervalValue } from './IntegerInterval'

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | { start: number | null; end: number | null }
  | { start: string | null; end: string | null }
  | { uuid: string; type?: string; code?: string; name: string }
  | { uuid: string; type?: string; code?: string; name: string }[]
  | undefined
  | null

export type FilterValues = Record<string, FilterValue>

export interface FilterCollectionBuilderProps {
  featureKey: string
  scope?: string
  initialValues?: FilterValues
  onChangeFilter: (values: FilterValues) => void
  collection?: FiltersCollectionResponse
  /** Filter codes to hide from the UI (e.g. filters rendered elsewhere like search in header). */
  hiddenFilterCodes?: string[]
}

function getSelectOptions(choices: Record<string, string> | string[]) {
  if (Array.isArray(choices)) {
    return choices.map((c) => ({ value: c, label: c }))
  }
  return Object.entries(choices).map(([value, label]) => ({ value, label }))
}

function FilterCollectionBuilder({
  featureKey,
  scope,
  initialValues,
  onChangeFilter,
  collection: collectionProp,
  hiddenFilterCodes,
}: FilterCollectionBuilderProps) {
  const { data: collectionFromApi, isLoading } = useGetFiltersCollection({
    featureKey,
    scope,
    enabled: collectionProp === undefined,
  })
  const rawCollection = collectionProp ?? collectionFromApi
  const collection = useMemo(() => {
    if (!rawCollection?.length || !hiddenFilterCodes?.length) return rawCollection
    const set = new Set(hiddenFilterCodes)
    return rawCollection
      .map((group) => ({
        ...group,
        filters: group.filters.filter((f) => !set.has(f.code)),
      }))
      .filter((group) => group.filters.length > 0)
  }, [rawCollection, hiddenFilterCodes])
  const [values, setValues] = useState<FilterValues>(() => ({ ...(initialValues ?? {}) }))
  const [collapsedGroupIndices, setCollapsedGroupIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    setValues({ ...(initialValues ?? {}) })
  }, [initialValues])

  const toggleGroup = useCallback((groupIndex: number) => {
    setCollapsedGroupIndices((prev) => {
      const next = new Set(prev)
      if (next.has(groupIndex)) next.delete(groupIndex)
      else next.add(groupIndex)
      return next
    })
  }, [])

  const handleChange = useCallback(
    (code: string, value: FilterValue) => {
      setValues((prev) => {
        const next = { ...prev, [code]: value }
        onChangeFilter(next)
        return next
      })
    },
    [onChangeFilter],
  )

  const getFilterValue = useCallback(
    (code: string): string => {
      const v = values[code]
      if (typeof v === 'string') return v
      if (typeof v === 'number') return String(v)
      if (typeof v === 'boolean') return String(v)
      if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') return v[0]
      if (Array.isArray(v) && v.length > 0 && v[0] != null && typeof v[0] === 'object' && 'uuid' in v[0]) return (v[0] as { uuid: string }).uuid
      if (v != null && typeof v === 'object' && 'uuid' in v) return (v as { uuid: string }).uuid
      return ''
    },
    [values],
  )

  const getFilterValueForSelect = useCallback(
    (code: string, multiple?: boolean): string | null => {
      const v = values[code]
      if (v == null || v === '') return null
      if (typeof v === 'string') return v
      if (Array.isArray(v) && v.length > 0) return (v[0] as string) ?? null
      return null
    },
    [values],
  )

  const zoneProviderOptions = useMemo((): ZoneProviderOptions | undefined => {
    if (!collection?.length) return undefined
    for (const group of collection) {
      const zoneFilter = group.filters.find((f) => f.type === 'zone_autocomplete' && f.options != null)
      if (zoneFilter?.options && 'url' in zoneFilter.options) {
        return zoneFilter.options as unknown as ZoneProviderOptions
      }
    }
    return undefined
  }, [collection])

  const zoneProvider = useMemo(() => (zoneProviderOptions ? new ZoneProvider(zoneProviderOptions) : undefined), [zoneProviderOptions])

  if (collectionProp === undefined && isLoading) {
    return (
      <YStack gap="$small" padding="$medium" justifyContent="center" alignItems="center">
        <Spinner size="small" color="$blue6" />
        <Text.SM secondary>Chargement des filtres...</Text.SM>
      </YStack>
    )
  }

  if (!collection?.length) {
    return (
      <YStack padding="$medium">
        <Text.SM secondary>Aucun filtre disponible.</Text.SM>
      </YStack>
    )
  }

  return (
    <YStack gap="$medium">
      {collection.map((group: FilterGroup, groupIndex: number) => {
        const isCollapsed = collapsedGroupIndices.has(groupIndex)
        return (
          <YStack key={groupIndex} gap="$small">
            {group.label ? (
              <Pressable onPress={() => toggleGroup(groupIndex)}>
                <XStack alignItems="center" justifyContent="space-between" gap="$small">
                  <Text.LG semibold primary>
                    {group.label}
                  </Text.LG>
                  {isCollapsed ? <ChevronDown size={20} color="$textSecondary" /> : <ChevronUp size={20} color="$textSecondary" />}
                </XStack>
              </Pressable>
            ) : null}
            {!isCollapsed ? (
              <YStack gap="$small">
                {group.filters.map((filter: FilterDefinition, filterIndex: number) => (
                  <FilterField
                    key={`${filter.code}-${filterIndex}`}
                    filter={filter}
                    values={values}
                    getFilterValue={getFilterValue}
                    getFilterValueForSelect={getFilterValueForSelect}
                    onChange={handleChange}
                    zoneProvider={zoneProvider}
                    scope={scope}
                  />
                ))}
              </YStack>
            ) : null}
          </YStack>
        )
      })}
    </YStack>
  )
}

interface FilterFieldProps {
  filter: FilterDefinition
  values: FilterValues
  getFilterValue: (code: string) => string
  getFilterValueForSelect: (code: string, multiple?: boolean) => string | null
  onChange: (code: string, value: FilterValue) => void
  zoneProvider?: SearchProvider
  scope?: string
}

function FilterField({ filter, values, getFilterValue, getFilterValueForSelect, onChange, zoneProvider, scope }: FilterFieldProps) {
  const { code, label, type, options } = filter

  if (type === 'text') {
    return <Input value={getFilterValue(code)} onChangeText={(text) => onChange(code, text || null)} placeholder={label} size="md" color="gray" />
  }

  if (type === 'select' && options && typeof options === 'object' && 'choices' in options) {
    const selectOpts = options as FilterOptionSelect
    const choices = selectOpts.choices
    if (!choices || typeof choices !== 'object') return null
    const optionsList = getSelectOptions(choices as Record<string, string>)
    const hasEmptyOption = optionsList.some((o) => o.value === '' || o.value === null)
    const isMultiple = selectOpts.multiple === true
    const currentValue = getFilterValueForSelect(code, isMultiple)
    return (
      <SelectV3
        label={label}
        value={currentValue ?? ''}
        options={optionsList}
        onChange={(value) => {
          if (value === '' || value === null) {
            onChange(code, isMultiple ? null : null)
          } else {
            onChange(code, isMultiple ? [value] : value)
          }
        }}
        noValuePlaceholder={selectOpts.placeholder ?? 'Choisir'}
        nullableOption={!hasEmptyOption ? 'Aucune sélection' : undefined}
        size="md"
        color="gray"
        resetable
      />
    )
  }

  if (type === 'integer_interval' && options && typeof options === 'object' && 'first' in options) {
    const opt = options as FilterOptionIntegerInterval
    const raw = values[code]
    const intervalValue: IntegerIntervalValue =
      raw && typeof raw === 'object' && 'start' in raw && 'end' in raw
        ? { start: (raw as IntegerIntervalValue).start ?? null, end: (raw as IntegerIntervalValue).end ?? null }
        : { start: null, end: null }
    return (
      <IntegerInterval
        labelFrom={opt.first?.label}
        labelTo={opt.second?.label}
        value={intervalValue}
        onChange={(v) => onChange(code, v)}
        options={opt}
        size="md"
        color="gray"
      />
    )
  }

  if (type === 'date_interval') {
    const raw = values[code]
    const intervalValue: DateIntervalValue =
      raw && typeof raw === 'object' && 'start' in raw && 'end' in raw
        ? { start: (raw as DateIntervalValue).start ?? null, end: (raw as DateIntervalValue).end ?? null }
        : { start: null, end: null }
    return (
      <DateInterval
        labelFrom={`${label} - Depuis`}
        labelTo={`${label} - Jusqu'au`}
        value={intervalValue}
        onChange={(v) => onChange(code, v)}
        size="md"
        color="gray"
        resetable
      />
    )
  }

  if (type === 'date') {
    const v = values[code]
    const strVal = typeof v === 'string' ? v : null
    return (
      <DateInput
        label={label}
        value={strVal}
        onChange={(value) => onChange(code, value)}
        placeholder={`Sélectionner ${label.toLowerCase()}`}
        size="md"
        color="gray"
        resetable
      />
    )
  }

  if (type === 'zone_autocomplete' && options && typeof options === 'object' && 'url' in options && zoneProvider) {
    const zoneOpts = options as FilterOptionZoneAutocomplete
    const isMultiple = zoneOpts.multiple === true
    const raw = values[code]
    const zoneDefaultValue = (() => {
      if (Array.isArray(raw) && raw.length > 0 && raw[0] != null && typeof raw[0] === 'object' && 'uuid' in raw[0]) {
        const z = raw[0] as { uuid: string; name?: string; code?: string }
        return { value: z.uuid, label: `${z.name ?? ''} (${z.code ?? ''})`.trim() || z.uuid }
      }
      if (raw != null && typeof raw === 'object' && 'uuid' in raw) {
        const z = raw as { uuid: string; name?: string; code?: string }
        return { value: z.uuid, label: `${z.name ?? ''} (${z.code ?? ''})`.trim() || z.uuid }
      }
      return undefined
    })()
    return (
      <GlobalSearch
        provider={zoneProvider}
        onSelect={(result: SearchResult | null) => {
          if (!result) {
            onChange(code, isMultiple ? null : null)
            return
          }
          const zone = {
            uuid: result.id,
            name: (result.metadata as { zone?: { name?: string } })?.zone?.name ?? '',
            code: (result.metadata as { zoneCode?: string })?.zoneCode ?? '',
          }
          onChange(code, isMultiple ? [zone] : zone)
        }}
        placeholder={label}
        scope={scope}
        defaultValue={zoneDefaultValue}
        nullable={true}
        helpText={zoneOpts.help ?? undefined}
      />
    )
  }

  if (__DEV__) {
    return <Input value={`Type: ${type} - Label: ${label}`} size="md" color="gray" disabled={true} />
  }
  return null
}

export default FilterCollectionBuilder
