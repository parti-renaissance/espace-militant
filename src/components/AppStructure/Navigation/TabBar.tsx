import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle, Platform, SafeAreaView as RNSafeAreaView, StyleSheet } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { usePathname, useRouter } from 'expo-router'
import { getThemes, isWeb, styled, ThemeableStack, withStaticProperties, YStack } from 'tamagui'
import { MoreHorizontal, Sparkle } from '@tamagui/lucide-icons'

import { useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'
import { FeaturebaseFooterItems } from '@/components/AppStructure/Navigation/FeaturebaseFooterItems'
import NavSheet, { NavSheetRef } from '@/components/AppStructure/Navigation/NavSheet'
import { ScopeSelector } from '@/components/AppStructure/Navigation/ScopeSelector'
import { isNavItemActive } from '@/components/AppStructure/utils'
import Text from '@/components/base/Text'

import { cadreNavItems, useMilitantNavItems, type NavItemConfig } from '@/config/navigationItems'
import type { IconComponent } from '@/models/common.model'
import { useGetUserScopes } from '@/services/profile/hook'

type Theme = 'blue' | 'purple' | 'green' | 'orange'

const SAV = Platform.OS !== 'ios' ? SafeAreaView : RNSafeAreaView
const SAVProps: { edges?: ('bottom' | 'top' | 'left' | 'right')[] } = Platform.OS !== 'ios' ? { edges: ['bottom'] } : {}

const springConfig = {
  duration: 350,
  dampingRatio: 0.75,
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

const TabBarComponent = withStaticProperties(TabBarFrame, { Tab: TabFrame })

type TabProps = {
  name: string
  isFocus: boolean
  label: string
  icon: IconComponent
  theme?: Theme
  externalLink?: boolean
  onPressRef: React.MutableRefObject<((id: string) => void) | null>
  tabId: string
  onLayoutRef: React.MutableRefObject<((key: string, layout: LayoutRectangle) => void) | null>
  layoutKey: string
  activeColorVal?: string
  inactiveColorVal?: string
}

const Tab = ({
  isFocus,
  label,
  icon: Icon,
  theme = 'blue',
  externalLink,
  onPressRef,
  tabId,
  onLayoutRef,
  layoutKey,
  activeColorVal,
  inactiveColorVal,
}: TabProps) => {
  const scale = useSharedValue(0)
  const themes = activeColorVal != null && inactiveColorVal != null ? null : getThemes()
  const activeColor = activeColorVal ?? themes?.light?.[`${theme}5`]?.val ?? themes?.light?.color5?.val ?? '#000'
  const inactiveColor = inactiveColorVal ?? themes?.light?.textPrimary?.val ?? '#666'
  const color = isFocus ? activeColor : inactiveColor

  const onPress = useCallback(() => {
    scale.value = withSpring(1, springConfig)
    onPressRef.current?.(tabId)
  }, [tabId, onPressRef])

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      onLayoutRef.current?.(layoutKey, e.nativeEvent.layout)
    },
    [layoutKey, onLayoutRef],
  )

  React.useEffect(() => {
    scale.value = withSpring(isFocus ? 1 : 0, springConfig)
  }, [isFocus])

  const animatedIconStyle = useAnimatedStyle(() => {
    if (externalLink) return { transform: [{ scale: 1 }, { translateY: 0 }] }
    return {
      transform: [
        { scale: interpolate(scale.value, [0, 1], [1, 1.334]) },
        { translateY: interpolate(scale.value, [0, 1], [0, 6]) },
      ],
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    if (externalLink) return { opacity: 1 }
    return { opacity: interpolate(scale.value, [0, 1], [1, 0]) }
  })

  return (
    <TabBarComponent.Tab theme={theme} onPress={onPress} group onLayout={onLayout} flex={1} width={50}>
      {Icon && (
        <Animated.View style={[animatedIconStyle]}>
          <Icon color={color} size={16} />
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

const DEFAULT_TAB_ORDER = ['accueil', 'evenements', 'parrainages', 'formations', 'more']
const CADRE_TAB_ORDER = ['accueil', 'evenements', 'cadreSheet', 'formations', 'more']
const SHEET_SWITCH_DELAY_MS = 200

const ConfigurableTabBar = ({ hide = false, navCadreItems = cadreNavItems }: ConfigurableTabBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { floatingContent } = useLayoutContext()
  const [activeSpecialTab, setActiveSpecialTab] = useState<string | null>(null)
  const themes = getThemes()
  const militantNavItems = useMilitantNavItems()
  const { data: userScopes } = useGetUserScopes({ enabled: true })

  const hasExecutiveScope = useMemo(() => {
    return userScopes?.some((s) => s.apps.includes('data_corner')) ?? false
  }, [userScopes])

  const visibleItemIds = useMemo(() => {
    return hasExecutiveScope ? CADRE_TAB_ORDER : DEFAULT_TAB_ORDER
  }, [hasExecutiveScope])

  const navItems = useMemo(() => {
    return militantNavItems.filter((item) => (item.displayIn ?? 'all') === 'all' || item.displayIn === 'tabbar')
  }, [militantNavItems])

  const getAllItems = useMemo(() => [...navItems, ...navCadreItems], [navItems, navCadreItems])
  const getConfig = useCallback((id: string) => getAllItems.find((item) => item.id === id), [getAllItems])

  const cadreItems = useMemo(() => {
    return navCadreItems
      .filter((item) => (item.displayIn ?? 'all') === 'all' || item.displayIn === 'tabbar')
      .map((item) => ({ ...item, active: isNavItemActive(pathname, item.href) }))
  }, [navCadreItems, pathname])

  const moreItems = useMemo(() => {
    return navItems
      .filter((item) => !visibleItemIds.includes(item.id))
      .map((item) => ({ ...item, active: isNavItemActive(pathname, item.href) }))
  }, [navItems, visibleItemIds, pathname])

  const currentRouteId = useMemo(() => {
    return getAllItems.find((item) => isNavItemActive(pathname, item.href))?.id || null
  }, [pathname, getAllItems])

  const activeTabKey = useMemo(() => {
    if (activeSpecialTab) return activeSpecialTab
    if (!currentRouteId) return visibleItemIds.includes('more') ? 'more' : visibleItemIds[0] || 'accueil'
    if (visibleItemIds.includes(currentRouteId)) return currentRouteId
    if (cadreItems.some((item) => item.id === currentRouteId) && visibleItemIds.includes('cadreSheet')) return 'cadreSheet'
    if (moreItems.some((item) => item.id === currentRouteId) && visibleItemIds.includes('more')) return 'more'
    return visibleItemIds.includes('more') ? 'more' : visibleItemIds[0] || 'accueil'
  }, [currentRouteId, visibleItemIds, cadreItems, moreItems, activeSpecialTab])

  const layoutsByKey = useRef(new Map<string, LayoutRectangle>())
  const getPosition = useCallback((layout: LayoutRectangle) => layout.x + layout.width / 2 - (isWeb ? 50 : 27), [])
  const getPositionFromKey = useCallback(
    (key: string) => {
      const layout = layoutsByKey.current.get(key)
      return layout ? getPosition(layout) : 0
    },
    [getPosition],
  )

  const position = useSharedValue(0)
  const activeColor = useSharedValue(themes.light.gray1.val)

  const moreSheetRef = useRef<NavSheetRef>(null)
  const cadreSheetRef = useRef<NavSheetRef>(null)

  const handleTabPress = useCallback(
    (id: string) => {
      const sheetsMap: Record<string, React.RefObject<NavSheetRef | null>> = {
        more: moreSheetRef,
        cadreSheet: cadreSheetRef,
      }
      const targetSheet = sheetsMap[id]

      if (targetSheet) {
        if (activeSpecialTab === id) {
          targetSheet.current?.close()
          setActiveSpecialTab(null)
          return
        }
        if (activeSpecialTab && sheetsMap[activeSpecialTab]) {
          sheetsMap[activeSpecialTab].current?.close()
          setTimeout(() => {
            targetSheet.current?.expand()
            setActiveSpecialTab(id)
          }, SHEET_SWITCH_DELAY_MS)
          return
        }
        targetSheet.current?.expand()
        setActiveSpecialTab(id)
        return
      }

      // Normal tab
      moreSheetRef.current?.close()
      cadreSheetRef.current?.close()
      setActiveSpecialTab(null)
      if (id === currentRouteId) return

      const config = getConfig(id)
      if (config) {
        if (config.onPress) config.onPress()
        else if (config.href) router.navigate(config.href)
      }
    },
    [activeSpecialTab, currentRouteId, getConfig, router],
  )

  const handleTabPressRef = useRef(handleTabPress)
  useLayoutEffect(() => {
    handleTabPressRef.current = handleTabPress
  }, [handleTabPress])

  const saveLayoutToRef = useCallback(
    (key: string, layout: LayoutRectangle) => {
      layoutsByKey.current.set(key, layout)
      if (key === activeTabKey) {
        position.value = getPosition(layout)
      }
    },
    [activeTabKey, getPosition],
  )
  const handleSaveLayoutRef = useRef(saveLayoutToRef)
  useLayoutEffect(() => {
    handleSaveLayoutRef.current = saveLayoutToRef
  }, [saveLayoutToRef])

  React.useEffect(() => {
    if (activeTabKey) {
      const pos = getPositionFromKey(activeTabKey)
      position.value = withSpring(pos)

      let theme: Theme = 'blue'
      if (activeTabKey === 'cadreSheet') theme = 'purple'
      else if (activeTabKey !== 'more') {
        const config = getConfig(activeTabKey)
        theme = (config?.theme ?? 'blue') as Theme
      }
      const colorVal = themes.light[`${theme}1`]?.val ?? themes.light.gray1.val
      activeColor.value = withDelay(50, withTiming(colorVal, { duration: 150 }))
    }
  }, [activeTabKey, getConfig, themes, getPositionFromKey])

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    backgroundColor: activeColor.value,
  }))

  const handleSheetClose = useCallback((id?: string) => {
    setActiveSpecialTab((current) => (current === id ? null : current))
  }, [])

  const getTabProps = useCallback(
    (id: string): (TabProps & { key: string }) | null => {
      const isFocus = activeTabKey === id
      const common = {
        isFocus,
        onPressRef: handleTabPressRef,
        onLayoutRef: handleSaveLayoutRef,
        inactiveColorVal: themes.light.textPrimary.val,
      }
      if (id === 'more') {
        return {
          key: 'more',
          name: 'more',
          label: 'Autre',
          icon: MoreHorizontal,
          theme: 'blue',
          tabId: 'more',
          layoutKey: 'more',
          activeColorVal: themes.light.blue5?.val,
          ...common,
        }
      }
      if (id === 'cadreSheet') {
        return {
          key: 'cadreSheet',
          name: 'cadreSheet',
          label: 'Cadre',
          icon: Sparkle,
          theme: 'purple',
          tabId: 'cadreSheet',
          layoutKey: 'cadreSheet',
          activeColorVal: themes.light.purple5?.val,
          ...common,
        }
      }
      const config = getConfig(id)
      if (!config) return null
      const themeKey = (config.theme ?? 'blue') as Theme
      return {
        key: id,
        name: id,
        label: config.text,
        icon: config.iconLeft,
        theme: themeKey,
        externalLink: config.externalUrlSlug ? true : false,
        tabId: id,
        layoutKey: id,
        activeColorVal: themes.light[`${themeKey}5`]?.val,
        ...common,
      }
    },
    [activeTabKey, getConfig, themes],
  )

  return (
    <>
      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        opacity={hide ? 0 : 1}
        pointerEvents={hide ? 'none' : 'box-none'}
        {...(isWeb && hide ? { display: 'none' } : {})}
      >
        {floatingContent && (
          <LinearGradient
            colors={['rgba(242, 238, 238, 0)', 'rgba(238,240,242,0.8)', 'rgba(238,240,242,0.8)']}
            start={[0, 0]}
            end={[0, 1]}
            style={{ flex: 1, paddingTop: 16, paddingBottom: 16 }}
            pointerEvents="box-none"
          >
            <YStack flex={1} justifyContent="center" alignItems="center" pointerEvents="box-none">
              {floatingContent}
            </YStack>
          </LinearGradient>
        )}

        <SAV {...SAVProps} style={{ backgroundColor: 'white' }}>
          <TabBarComponent>
            <Animated.View style={[indicatorStyle.indicator, indicatorAnimatedStyle]} />
            {visibleItemIds.map((id) => {
              const props = getTabProps(id)
              if (!props) return null
              const { key, ...tabProps } = props
              return <MemoTab key={key} {...tabProps} />
            })}
          </TabBarComponent>
        </SAV>
      </YStack>

      <NavSheet ref={moreSheetRef} onClose={() => handleSheetClose('more')} items={moreItems} />
      <NavSheet
        ref={cadreSheetRef}
        onClose={() => handleSheetClose('cadreSheet')}
        items={cadreItems}
        showLine
        ListHeaderComponent={
          <YStack paddingHorizontal={16} mb={12}>
            <ScopeSelector />
          </YStack>
        }
        ListFooterComponent={<FeaturebaseFooterItems variant="button" />}
      />
    </>
  )
}

export default ConfigurableTabBar
