import { useCallback } from 'react'

import { assemblies } from '@/components/AssemblySelect/assemblies'
import { eventFiltersState } from '@/features_next/events/store/filterStore'

import { useSession } from '@/ctx/SessionProvider'
import { useGetProfil } from '@/services/profile/hook'

export default function useResetFilters() {
  const { setValue } = eventFiltersState()
  const { isAuth } = useSession()
  const { data: user } = useGetProfil({ enabled: isAuth })
  const defaultAssembly = user?.instances?.assembly?.code

  const handleReset = useCallback(() => {
    const assembly = defaultAssembly ? assemblies.find((a) => a.value === defaultAssembly) : undefined
    const detailZone = assembly ? { value: assembly.value, label: `${assembly.value} • ${assembly.label}` } : undefined
    setValue((x) => ({
      ...x,
      zone: defaultAssembly,
      detailZone,
      search: '',
    }))
  }, [defaultAssembly])

  return { handleReset }
}
