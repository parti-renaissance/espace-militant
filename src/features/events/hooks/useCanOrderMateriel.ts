import { useMemo } from 'react'

import { useSession } from '@/ctx/SessionProvider'
import type { RestHubItem } from '@/services/hub/schema'
import { useGetUserScopes } from '@/services/profile/hook'
import { isExecutiveCadreScope } from '@/services/profile/utils'

export const hasEditableItemInAgenda = (items: RestHubItem[]): boolean => items.some((item) => item.editable)

export const useCanOrderMateriel = (hubItems: RestHubItem[]) => {
  const { isAuth } = useSession()
  const { data: userScopes, isLoading: isScopesLoading } = useGetUserScopes({ enabled: isAuth })

  const isCadre = useMemo(() => userScopes?.some(isExecutiveCadreScope) ?? false, [userScopes])

  const hasEditableItem = useMemo(() => hasEditableItemInAgenda(hubItems), [hubItems])

  const canOrderMateriel = isCadre || hasEditableItem

  return {
    canOrderMateriel,
    isCadre,
    hasEditableItem,
    isLoading: isAuth && isScopesLoading,
  }
}
