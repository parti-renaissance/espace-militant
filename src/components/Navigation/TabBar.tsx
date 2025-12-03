import React, { useCallback, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle, Platform, SafeAreaView as RNSafeAreaView, StyleSheet } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import Text from '@/components/base/Text'
import { MoreHorizontal, Sparkle } from '@tamagui/lucide-icons'
import { getThemes, isWeb, styled, ThemeableStack, withStaticProperties, XStack, YStack } from 'tamagui'
import NavSheet, { NavSheetRef } from '@/components/Navigation/NavSheet'
import { useRouter, usePathname } from 'expo-router'
import { useMilitantNavItems, cadreNavItems, type NavItemConfig } from '@/config/navigationItems'
import { isNavItemActive } from './utils'
import { ScopeSelector } from './ScopeSelector'
import { HelpMenuItems } from './HelpMenuItems'
import { useGetUserScopes } from '@/services/profile/hook'

type Theme = 'blue' | 'purple' | 'green' | 'orange'

const SAV = Platform.OS !== 'ios' ? SafeAreaView : RNSafeAreaView
const SAVProps: any = Platform.OS !== 'ios' ? { edges: ['bottom'] } : {}

const springConfig = {
  duration: 2000,
  dampingRatio: 0.7,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  stiffness: 1,
}

const indicatorStyle = StyleSheet.create({
  indicator: {
    height: 54,
    width: 54,
    position: 'absolute',
    borderRadius: 999,
    top: 4,
  },
})

const TabFrame = styled(ThemeableStack, {
  tag: 'button',
  paddingHorizontal: 4,
  flexDirection: 'column',
  gap: 7,
  borderRadius: 999,
  justifyContent: 'center',
  alignItems: 'center',
  height: 54,
  backgroundColor: 'transparent',
  borderWidth: 0,
})

const TabBarFrame = styled(ThemeableStack, {
  flexDirection: 'row',
  borderTopWidth: 1,
  borderColor: '$textOutline20',
  justifyContent: 'space-between',
  paddingHorizontal: 22,
  backgroundColor: 'white',
  alignItems: 'center',
  height: 64,
})

const TabBarComponent = withStaticProperties(TabBarFrame, {
  Tab: TabFrame,
})

type TabProps = {
  name: string
  isFocus: boolean
  onPress: () => void
  label: string
  icon: any
  theme?: Theme
  onLayout: (e: LayoutChangeEvent) => void
}

const Tab = ({ isFocus, name, onPress, onLayout, label, icon: Icon, theme = 'blue' }: TabProps) => {
  const scale = useSharedValue(0)
  const themes = getThemes()

  const handlePress = () => {
    scale.value = withSpring(1, { duration: 350 })
    onPress()
  }

  React.useEffect(() => {
    scale.value = withSpring(isFocus ? 1 : 0, { duration: 350 })
  }, [isFocus])

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.334]) }, { translateY: interpolate(scale.value, [0, 1], [0, 6]) }],
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scale.value, [0, 1], [1, 0]),
    }
  })

  const activeColor = themes.light[`${theme}5`]?.val ?? themes.light.color5.val
  const inactiveColor = themes.light.textPrimary.val
  const color = isFocus ? activeColor : inactiveColor

  return (
    <TabBarComponent.Tab theme={theme as any} onPress={handlePress} group onLayout={onLayout} flex={1} width={50}>
      {Icon && (
        <Animated.View style={[animatedIconStyle]}>
          <Icon color={color} size={16} focused={isFocus} />
        </Animated.View>
      )}
      <Animated.View style={[animatedTextStyle]}>
        <Text.XSM semibold color={color}>
          {label}
        </Text.XSM>
      </Animated.View>
    </TabBarComponent.Tab>
  )
}
const MemoTab = React.memo(Tab)

type ConfigurableTabBarProps = {
  hide?: boolean
  navCadreItems?: NavItemConfig[]
}

const DEFAULT_TAB_ORDER = ['accueil', 'evenements', 'parrainages', 'ressources', 'more']
const CADRE_TAB_ORDER = ['accueil', 'evenements', 'cadreSheet', 'ressources', 'more']

const ConfigurableTabBar = ({ hide, navCadreItems = cadreNavItems }: ConfigurableTabBarProps = {} as ConfigurableTabBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSpecialTab, setActiveSpecialTab] = useState<string | null>(null)
  const themes = getThemes()
  const militantNavItems = useMilitantNavItems()

  const { data: userScopes } = useGetUserScopes()

  const hasExecutiveScope = useMemo(() => {
    return userScopes?.some((s) => s.apps.includes('data_corner')) ?? false
  }, [userScopes])

  const visibleItemIds = useMemo(() => {
    return hasExecutiveScope ? CADRE_TAB_ORDER : DEFAULT_TAB_ORDER
  }, [hasExecutiveScope])

  // Filter items based on displayIn property (default to 'all')
  const navItems = useMemo(() => {
    return militantNavItems.filter(item => {
      const displayIn = item.displayIn ?? 'all'
      return displayIn === 'all' || displayIn === 'tabbar'
    })
  }, [])

  // Helper to get config by ID
  const getAllItems = useMemo(() => [...navItems, ...navCadreItems], [navItems, navCadreItems])
  const getConfig = (id: string) => getAllItems.find((item) => item.id === id)

  // Identify items for sheets
  const cadreItems = useMemo(() => {
    const filtered = navCadreItems.filter(item => {
      const displayIn = item.displayIn ?? 'all'
      return displayIn === 'all' || displayIn === 'tabbar'
    })
    // Add active state based on current pathname (including sub-routes)
    return filtered.map(item => ({
      ...item,
      active: isNavItemActive(pathname, item.href),
    }))
  }, [navCadreItems, pathname])

  const moreItems = useMemo(() => {
    const filtered = navItems.filter((item) => !visibleItemIds.includes(item.id))
    // Add active state based on current pathname (including sub-routes)
    return filtered.map(item => ({
      ...item,
      active: isNavItemActive(pathname, item.href),
    }))
  }, [navItems, visibleItemIds, pathname])

  // Map pathname to route ID
  const currentRouteId = useMemo(() => {
    // Normalize pathname (remove trailing slash)
    const normalizedPathname = pathname.replace(/\/$/, '') || '/'

    // Find matching nav item by exact href match
    const matchingItem = getAllItems.find(item => {
      if (!item.href) return false
      const normalizedHref = item.href.replace(/\/$/, '') || '/'
      return normalizedHref === normalizedPathname
    })

    return matchingItem?.id || null
  }, [pathname, getAllItems])

  // Determine active tab key
  const activeTabKey = useMemo(() => {
    // Check if manually set (opened sheet)
    if (activeSpecialTab) return activeSpecialTab

    // If no route found, activate "Autre" (more)
    if (!currentRouteId) {
      if (visibleItemIds.includes('more')) return 'more'
      return visibleItemIds[0] || 'accueil'
    }

    // Check direct match with visible tabs
    if (visibleItemIds.includes(currentRouteId)) return currentRouteId

    // Check if route is a cadre item
    if (cadreItems.some(item => item.id === currentRouteId)) {
      if (visibleItemIds.includes('cadreSheet')) return 'cadreSheet'
    }

    // Check if route is in more items
    if (moreItems.some(item => item.id === currentRouteId)) {
      if (visibleItemIds.includes('more')) return 'more'
    }

    // Fallback to "Autre" (more) if route not found in any category
    if (visibleItemIds.includes('more')) return 'more'
    return visibleItemIds[0] || 'accueil'
  }, [currentRouteId, visibleItemIds, cadreItems, moreItems, activeSpecialTab])


  const layoutsByKey = useRef(new Map<string, LayoutRectangle>())
  const getPosition = (layout: LayoutRectangle) => {
    return layout.x + layout?.width / 2 - (isWeb ? 50 : 27)
  }

  const getPositionFromKey = (key: string) => {
    const layout = layoutsByKey.current.get(key)
    if (!layout) return 0
    return getPosition(layout)
  }

  const position = useSharedValue(0)
  const activeColor = useSharedValue(themes.light.gray1.val)

  React.useEffect(() => {
    if (activeTabKey) {
      const pos = getPositionFromKey(activeTabKey)
      position.value = withSpring(pos, springConfig)

      // Determine active color based on the active tab
      let theme: Theme = 'blue'
      if (activeTabKey === 'cadreSheet') {
        theme = 'purple'
      } else if (activeTabKey !== 'more') {
        const config = getAllItems.find((item) => item.id === activeTabKey)
        theme = (config?.theme ?? 'blue') as Theme
      }
      
      // Wait a bit for animation to complete
      setTimeout(() => {
        activeColor.value = themes.light[`${theme}1`]?.val ?? themes.light.gray1.val
      }, 100)
    }
  }, [activeTabKey, getAllItems, themes])

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
      backgroundColor: activeColor.value,
    }
  })

  const handleSaveLayout = (key: string) => (e: LayoutChangeEvent) => {
    if (layoutsByKey.current) {
      layoutsByKey.current.set(key, e.nativeEvent.layout)
      if (key === activeTabKey) {
        position.value = getPosition(e.nativeEvent.layout)
      }
    }
  }

  const moreSheetRef = useRef<NavSheetRef>(null)
  const cadreSheetRef = useRef<NavSheetRef>(null)

  const handleTabPress = (id: string) => {
    if (id === 'more') {
      if (activeSpecialTab === 'more') {
        moreSheetRef.current?.close()
      } else {
        moreSheetRef.current?.expand()
        cadreSheetRef.current?.close()
        setActiveSpecialTab('more')
      }
      return
    }
    if (id === 'cadreSheet') {
      if (activeSpecialTab === 'cadreSheet') {
        cadreSheetRef.current?.close()
      } else {
        cadreSheetRef.current?.expand()
        moreSheetRef.current?.close()
        setActiveSpecialTab('cadreSheet')
      }
      return
    }

    // Normal tab
    moreSheetRef.current?.close()
    cadreSheetRef.current?.close()
    setActiveSpecialTab(null)

    if (id === currentRouteId) return

    const config = getConfig(id)
    if (config) {
      if (config.onPress) {
        config.onPress()
      } else if (config.href) {
        router.navigate(config.href)
      }
    }
  }

  const handleSheetClose = useCallback((id?: string) => {
    setActiveSpecialTab((current) => {
      if (current === id) {
        return null
      }
      return current
    })
  }, [])

  return (
    <>
      <SAV
        {...SAVProps}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          opacity: hide ? 0 : 1,
          pointerEvents: hide ? 'none' : 'auto',
          ...(isWeb && hide ? { display: 'none' } : {}),
        }}
      >
        <TabBarComponent>
          <Animated.View style={[indicatorStyle.indicator, indicatorAnimatedStyle]} />
          {visibleItemIds.map((id) => {
            const isFocus = activeTabKey === id

            if (id === 'more') {
              return (
                <MemoTab
                  key="more"
                  name="more"
                  isFocus={isFocus}
                  onPress={() => handleTabPress('more')}
                  onLayout={handleSaveLayout('more')}
                  label="Autre"
                  icon={MoreHorizontal}
                  theme="blue"
                />
              )
            }

            if (id === 'cadreSheet') {
              return (
                <MemoTab
                  key="cadreSheet"
                  name="cadreSheet"
                  isFocus={isFocus}
                  onPress={() => handleTabPress('cadreSheet')}
                  onLayout={handleSaveLayout('cadreSheet')}
                  label="Cadre"
                  icon={Sparkle}
                  theme="purple"
                />
              )
            }

            const config = getConfig(id)
            if (!config) return null

            return (
              <MemoTab
                key={id}
                name={id}
                isFocus={isFocus}
                onPress={() => handleTabPress(id)}
                onLayout={handleSaveLayout(id)}
                label={config.text}
                icon={config.iconLeft}
                theme={(config.theme ?? 'blue') as Theme}
              />
            )
          })}
        </TabBarComponent>
      </SAV>

      <NavSheet
        ref={moreSheetRef}
        onClose={() => handleSheetClose('more')}
        items={moreItems}
      />
      <NavSheet
        ref={cadreSheetRef}
        onClose={() => handleSheetClose('cadreSheet')}
        items={cadreItems}
        ListHeaderComponent={
          <YStack paddingHorizontal={16}>
            <ScopeSelector />
          </YStack>
        }
        ListFooterComponent={<HelpMenuItems variant="button" />}
      />
    </>
  )
}

export default ConfigurableTabBar
