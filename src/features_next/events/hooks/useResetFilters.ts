import { useCallback } from 'react'

import { eventFiltersState } from '@/features_next/events/store/filterStore'

import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil } from '@/services/profile/hook'

export default function useResetFilters() {
  const { setValue } = eventFiltersState()
  const { isAuth } = useSession()
  const { data: user } = useGetProfil({ enabled: isAuth })
  const defaultAssembly = user?.instances?.assembly?.code

  const handleReset = useCallback(() => {
    setValue((x) => ({
      ...x,
      zone: defaultAssembly,
      detailZone: undefined,
      search: '',
    }))
  }, [defaultAssembly])

  return { handleReset }
}
