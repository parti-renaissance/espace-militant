import { useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

import * as S from '../schemas/messageBuilderSchema'
import { useEditorStore } from '@/features_next/publications/components/Editor/store/editorStore'
import { usePutMessageFilters } from '@/services/publications/hook'

import type { SelectedFiltersType } from '../RenderFields/SelectFilters/type'

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

  delete mappedFilters.uuid

  return mappedFilters
}

export function useAutoSaveFilters(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const messageId = useEditorStore((s) => s.messageId)
  const scope = useEditorStore((s) => s.scope)
  const { control, setValue } = useFormContext<S.GlobalForm>()
  const filtersData = useWatch({ control, name: 'filters.data' }) as SelectedFiltersType | undefined
  const previousValueRef = useRef<SelectedFiltersType | undefined>(undefined)
  const isInitialMount = useRef(true)

  const { mutate: putMessageFilters, isPending } = usePutMessageFilters({ messageId, scope })

  const debouncedSave = useDebouncedCallback(
    (filters: SelectedFiltersType) => {
      if (!messageId || !scope || !enabled) return
      const prev = previousValueRef.current
      const mapped = temporaryMapFiltersForApi(filters)
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

    const currentFilters = filtersData ?? { adherent_tags: 'adherent' }

    if (isInitialMount.current) {
      isInitialMount.current = false
      previousValueRef.current = currentFilters
      return
    }

    debouncedSave(currentFilters)
  }, [filtersData, enabled, debouncedSave])

  return { isPending, lastError: null }
}
