import { useCallback, useMemo } from 'react'
import { usePathname, useRouter } from 'expo-router'
import { Sparkle } from '@tamagui/lucide-icons'

import { useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'
import { isNavItemActive } from '@/components/AppStructure/utils'

import { cadreNavItems, useMilitantNavItems, type NavItemConfig } from '@/config/navigationItems'
import { useGetUserScopes } from '@/services/profile/hook'
import { isExecutiveCadreScope } from '@/services/profile/utils'

import type { FloatingTabBarItem, FloatingTabBarProps } from './FloatingTabBar'

type Theme = NonNullable<FloatingTabBarItem['theme']>

const DEFAULT_TAB_ORDER = ['accueil', 'evenements', 'soutenir', 'idees']
const CADRE_TAB_ORDER = ['accueil', 'evenements', 'cadreSheet', 'soutenir', 'idees']

export type UseFloatingTabBarOptions = {
  hide?: boolean
  navCadreItems?: NavItemConfig[]
}

export function useFloatingTabBar({ hide = false, navCadreItems = cadreNavItems }: UseFloatingTabBarOptions = {}): FloatingTabBarProps {
  const router = useRouter()
  const pathname = usePathname()
  const { floatingContent } = useLayoutContext()
  const militantNavItems = useMilitantNavItems()
  const { data: userScopes } = useGetUserScopes({ enabled: true })

  const hasExecutiveScope = useMemo(() => userScopes?.some(isExecutiveCadreScope) ?? false, [userScopes])

  const visibleItemIds = useMemo(() => (hasExecutiveScope ? CADRE_TAB_ORDER : DEFAULT_TAB_ORDER), [hasExecutiveScope])

  const navItems = useMemo(() => militantNavItems.filter((item) => (item.displayIn ?? 'all') === 'all' || item.displayIn === 'tabbar'), [militantNavItems])

  const getAllItems = useMemo(() => [...navItems, ...navCadreItems], [navItems, navCadreItems])
  const getConfig = useCallback((id: string) => getAllItems.find((item) => item.id === id), [getAllItems])

  const cadreSheetItems = useMemo(
    () =>
      navCadreItems
        .filter((item) => (item.displayIn ?? 'all') === 'all' || item.displayIn === 'tabbar')
        .map((item) => ({ ...item, active: isNavItemActive(pathname, item.href) })),
    [navCadreItems, pathname],
  )

  const currentRouteId = useMemo(() => getAllItems.find((item) => isNavItemActive(pathname, item.href))?.id ?? null, [pathname, getAllItems])

  const activeId = useMemo(() => {
    const fallbackId = visibleItemIds[0] ?? 'accueil'
    if (!currentRouteId) return fallbackId
    if (visibleItemIds.includes(currentRouteId)) return currentRouteId
    if (cadreSheetItems.some((item) => item.id === currentRouteId) && visibleItemIds.includes('cadreSheet')) return 'cadreSheet'
    return fallbackId
  }, [currentRouteId, visibleItemIds, cadreSheetItems])

  const items = useMemo(
    () =>
      visibleItemIds
        .map((id): FloatingTabBarItem | null => {
          if (id === 'cadreSheet') {
            return { id, label: 'Cadre', icon: Sparkle, theme: 'pink' }
          }
          const config = getConfig(id)
          if (!config) return null
          return {
            id,
            label: config.text,
            icon: config.iconLeft,
            theme: (config.theme ?? 'blue') as Theme,
          }
        })
        .filter((item): item is FloatingTabBarItem => item != null),
    [visibleItemIds, getConfig],
  )

  const onTabPress = useCallback(
    (id: string) => {
      const config = getConfig(id)
      if (!config) return
      if (config.onPress) config.onPress()
      else if (config.href) router.navigate(config.href)
    },
    [getConfig, router],
  )

  return {
    items,
    activeId,
    onTabPress,
    cadreSheetItems,
    floatingContent,
    hide,
  }
}
