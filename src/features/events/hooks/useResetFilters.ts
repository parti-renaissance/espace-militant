import { useCallback } from 'react'
import { eventFiltersState } from '@/features/events/store/filterStore'

export default function useResetFilters() {
  const { setValue } = eventFiltersState()

  const handleReset = useCallback(() => {
    setValue((x) => ({
      ...x,
      detailZone: undefined,
      search: '',
    }))
  }, [])

  return { handleReset }
}
