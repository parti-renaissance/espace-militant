import { useCallback } from 'react'
import { useSession } from '@/ctx/SessionProvider'
import { eventFiltersState } from '@/features/events/store/filterStore'
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
