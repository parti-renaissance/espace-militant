import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { isEqual } from 'lodash'
import { useFormContext, useWatch } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

import { useEditorStore } from '@/features_next/publications/components/Editor/store/editorStore'

import { usePutMessageFilters } from '@/services/publications/hook'

import { deserializeScopeTargets } from '../RenderFields/SelectFilters/AdvancedFilters/ScopeTarget'
import type { SelectedFiltersType } from '../RenderFields/SelectFilters/type'
import * as S from '../schemas/messageBuilderSchema'

/** Normalise les filtres (form ou backend) vers la forme payload API pour comparaison. */
const temporaryMapFiltersForApi = (filters: SelectedFiltersType): SelectedFiltersType => {
  const mappedFilters = { ...filters }

  if (mappedFilters.zone && typeof mappedFilters.zone === 'object' && 'uuid' in mappedFilters.zone) {
    mappedFilters.zone = (mappedFilters.zone as { uuid: string }).uuid
  } else if (!mappedFilters.zone && mappedFilters.zones && Array.isArray(mappedFilters.zones) && mappedFilters.zones.length > 0) {
    const firstZone = mappedFilters.zones[0] as { uuid: string; type: string; code: string; name: string }
    mappedFilters.zone = firstZone.uuid
  }

  if (mappedFilters.committee != null) {
    if (typeof mappedFilters.committee === 'object' && 'uuid' in mappedFilters.committee) {
      mappedFilters.committee = (mappedFilters.committee as { uuid: string }).uuid
    }
  }

  if ('scope_targets' in mappedFilters) {
    const grouped = deserializeScopeTargets(mappedFilters.scope_targets)
    mappedFilters.scope_targets = grouped.length > 0 ? grouped : null
  }

  delete mappedFilters.uuid

  return mappedFilters
}

/** Clés présentes côté backend mais absentes du formulaire / payload PUT — à retirer avant comparaison. */
const BACKEND_ONLY_KEYS = ['uuid'] as const

/** Retire les métadonnées strictement backend pour comparer uniquement les données de filtres. */
function stripBackendOnlyMetadata<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj }
  for (const key of BACKEND_ONLY_KEYS) {
    delete out[key]
  }
  return out as T
}

/** Retourne true si les filtres form sont identiques au backend (cache ou dernière sauvegarde). Évite les PUT inutiles. */
function areFiltersEqualToBackend(formMapped: SelectedFiltersType, backendSnapshot: SelectedFiltersType | undefined): boolean {
  if (backendSnapshot == null) return false
  const backendNormalized = temporaryMapFiltersForApi(backendSnapshot as SelectedFiltersType)
  const backendMapped = stripBackendOnlyMetadata(backendNormalized as Record<string, unknown>) as SelectedFiltersType
  return isEqual(formMapped, backendMapped)
}

export function useAutoSaveFilters(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const messageId = useEditorStore((s) => s.messageId)
  const scope = useEditorStore((s) => s.scope)
  const queryClient = useQueryClient()
  const { control, setValue } = useFormContext<S.GlobalForm>()
  const filtersData = useWatch({ control, name: 'filters.data' }) as SelectedFiltersType | undefined
  const previousValueRef = useRef<SelectedFiltersType | undefined>(undefined)

  const { mutate: putMessageFilters, isPending } = usePutMessageFilters({ messageId, scope })

  const debouncedSave = useDebouncedCallback(
    (filters: SelectedFiltersType) => {
      if (!messageId || !scope || !enabled) return
      const backendFromCache = queryClient.getQueryData<SelectedFiltersType>(['message-filters', messageId])
      // Tant que le backend n'a pas répondu au moins une fois, on ne peut rien comparer → on n'envoie pas de PUT.
      if (backendFromCache === undefined) return
      const mapped = temporaryMapFiltersForApi(filters)
      const backendSnapshot = previousValueRef.current ?? backendFromCache
      if (areFiltersEqualToBackend(mapped, backendSnapshot)) {
        return
      }
      const prev = previousValueRef.current
      putMessageFilters(mapped, {
        onSuccess: () => {
          previousValueRef.current = filters
        },
        onError: () => {
          if (prev !== undefined) {
            setValue('filters.data', prev, { shouldDirty: false })
          }
        },
      })
    },
    500,
    { leading: false, trailing: true },
  )

  useEffect(() => {
    if (!enabled) return
    if (filtersData === undefined) return
    debouncedSave(filtersData)
  }, [filtersData, enabled, debouncedSave])

  return { isPending, lastError: null }
}
