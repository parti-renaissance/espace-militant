import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutRectangle, Pressable, StyleSheet, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, type AnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { isWeb, styled, useTheme, XStack, YStack } from 'tamagui'

import { FeaturebaseFooterItems } from '@/components/AppStructure/Navigation/FeaturebaseFooterItems'
import NavSheet, { type NavSheetRef } from '@/components/AppStructure/Navigation/NavSheet'
import { ScopeSelector } from '@/components/AppStructure/Navigation/ScopeSelector'
import Text from '@/components/base/Text'

import type { NavItemConfig } from '@/config/navigationItems'
import type { IconComponent } from '@/models/common.model'

import { estimateTabBarLayerHeight, layout } from './floatingTabBarLayout'

export { TABBAR_LAYER_HEIGHT } from './floatingTabBarLayout'

type Theme = 'blue' | 'pink' | 'green' | 'orange'

export type FloatingTabBarItem = {
  id: string
  label: string
  icon: IconComponent
  theme?: Theme
  badge?: number | boolean
}

export type FloatingTabBarProps = {
  items: FloatingTabBarItem[]
  initialActiveId?: string
  activeId?: string
  currentRouteId?: string | null
  onTabPress?: (id: string) => void
  cadreSheetItems?: NavItemConfig[]
  cadreSheetHeader?: React.ReactNode
  cadreSheetFooter?: React.ReactNode
  floatingContent?: React.ReactNode
  hide?: boolean
}

const springConfig = { duration: 350, dampingRatio: 0.75 }

const TabBarInset = styled(YStack, {
  width: '100%',
  paddingHorizontal: 24,
  pointerEvents: 'box-none',
})

function useTabBarThemeColors() {
  const theme = useTheme()

  return useMemo(
    () => ({
      surfaceSunken: theme.gray100.val,
      surfacePage: theme.textSurface?.val ?? theme.gray50.val,
      selectionFill: theme.white3.val,
      badgeRed: theme.red5.val,
      inactiveColor: theme.textSecondary.val,
    }),
    [theme],
  )
}

const TabBadge = ({ badge, bgColor }: { badge: number | boolean; bgColor: string }) => {
  const isDot = badge === true
  const label = typeof badge === 'number' ? (badge > 9 ? '9+' : String(badge)) : null

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, isDot ? styles.badgeDot : styles.badgeCount]}>
      {!isDot && label && (
        <Text style={styles.badgeText} semibold>
          {label}
        </Text>
      )}
    </View>
  )
}

type TabProps = {
  item: FloatingTabBarItem
  isFocus: boolean
  isLast: boolean
  onPress: (id: string) => void
  onLayout: (key: string, layout: LayoutRectangle) => void
  inactiveColorVal: string
  badgeBgColor: string
}

const Tab = ({ item, isFocus, isLast, onPress, onLayout, inactiveColorVal, badgeBgColor }: TabProps) => {
  const { id, label, icon: Icon, theme = 'blue', badge } = item
  const globalTheme = useTheme()
  const activeColor = globalTheme[`${theme}5`]?.val ?? globalTheme.blue5.val
  const color = isFocus ? activeColor : inactiveColorVal

  return (
    <View style={[styles.tabSlot, !isLast && styles.tabSlotOverlap]} onLayout={(e) => onLayout(id, e.nativeEvent.layout)}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocus }}
        accessibilityLabel={label}
        onPress={() => onPress(id)}
        style={styles.tabPressable}
      >
        <View style={styles.iconWrapper}>
          {Icon && <Icon color={color} size={20} />}
          {badge != null && <TabBadge badge={badge} bgColor={badgeBgColor} />}
        </View>
        <Text.XSM semibold color={color} textAlign="center" {...(isWeb ? { userSelect: 'none' } : {})}>
          {label}
        </Text.XSM>
      </Pressable>
    </View>
  )
}
const MemoTab = React.memo(Tab)

const SelectionIndicator = ({ style, fillColor }: { style: AnimatedStyle<ViewStyle>; fillColor: string }) => (
  <Animated.View style={[styles.indicator, { backgroundColor: fillColor }, style]} pointerEvents="none" />
)

export const FloatingTabBar = ({
  items,
  initialActiveId,
  activeId,
  currentRouteId,
  onTabPress,
  cadreSheetItems = [],
  cadreSheetHeader,
  cadreSheetFooter,
  floatingContent,
  hide = false,
}: FloatingTabBarProps) => {
  const insets = useSafeAreaInsets()
  const colors = useTabBarThemeColors()

  const position = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)

  const isControlled = activeId !== undefined
  const [internalActiveId, setInternalActiveId] = useState(initialActiveId ?? items[0]?.id ?? '')
  const activeRouteId = isControlled ? activeId : internalActiveId
  const [activeSpecialTab, setActiveSpecialTab] = useState<string | null>(null)
  const [tabBarOffset, setTabBarOffset] = useState(() => estimateTabBarLayerHeight(insets.bottom, Boolean(floatingContent)))

  const activeTabId = activeSpecialTab ?? activeRouteId

  const cadreSheetRef = useRef<NavSheetRef>(null)
  const layoutsByKey = useRef(new Map<string, LayoutRectangle>())
  const prevActiveRouteId = useRef(activeRouteId)

  const latestPropsAndState = useRef({ activeRouteId, currentRouteId, activeSpecialTab, isControlled, onTabPress })
  latestPropsAndState.current = { activeRouteId, currentRouteId, activeSpecialTab, isControlled, onTabPress }

  const hasCadreSheet = items.some((item) => item.id === 'cadreSheet') && cadreSheetItems.length > 0

  const animateToTab = useCallback(
    (tabId: string, smooth = true) => {
      const tabLayout = layoutsByKey.current.get(tabId)
      if (!tabLayout) return

      if (smooth) {
        position.value = withSpring(tabLayout.x, springConfig)
        indicatorWidth.value = withSpring(tabLayout.width, springConfig)
      } else {
        position.value = tabLayout.x
        indicatorWidth.value = tabLayout.width
      }
    },
    [indicatorWidth, position],
  )

  const closeCadreSheet = useCallback(() => {
    cadreSheetRef.current?.close()
  }, [])

  const handleTabPress = useCallback(
    (id: string) => {
      const {
        currentRouteId: matchedRoute,
        activeSpecialTab: currentSpecial,
        isControlled: ctrl,
        onTabPress: cb,
      } = latestPropsAndState.current

      if (id === 'cadreSheet' && hasCadreSheet) {
        if (currentSpecial === 'cadreSheet') {
          closeCadreSheet()
          setActiveSpecialTab(null)
        } else {
          cadreSheetRef.current?.expand()
          setActiveSpecialTab('cadreSheet')
          animateToTab(id)
        }
        return
      }

      closeCadreSheet()
      setActiveSpecialTab(null)

      if (matchedRoute != null && id === matchedRoute) {
        cb?.(id)
        return
      }

      if (!ctrl) setInternalActiveId(id)
      animateToTab(id)
      cb?.(id)
    },
    [animateToTab, closeCadreSheet, hasCadreSheet],
  )

  const saveLayoutToRef = useCallback(
    (key: string, tabLayout: LayoutRectangle) => {
      const isFirstLayout = !layoutsByKey.current.has(key)
      layoutsByKey.current.set(key, tabLayout)

      if (key === activeTabId && isFirstLayout) {
        animateToTab(key, false)
      }
    },
    [activeTabId, animateToTab],
  )

  useEffect(() => {
    animateToTab(activeTabId)
  }, [activeTabId, animateToTab])

  useEffect(() => {
    if (prevActiveRouteId.current === activeRouteId) return
    prevActiveRouteId.current = activeRouteId
    setActiveSpecialTab(null)
    closeCadreSheet()
  }, [activeRouteId, closeCadreSheet])

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    left: position.value,
    width: indicatorWidth.value,
  }))

  const sheetProps = useMemo(() => ({ behindTabBar: true as const, tabBarOffset }), [tabBarOffset])
  const layerHideStyle = hide ? styles.hiddenLayer : null
  const bottomInset = Math.max(layout.bottomPadding, insets.bottom)

  const cadreSheetListHeader = cadreSheetHeader ?? (
    <YStack paddingHorizontal={16} marginBottom={12}>
      <ScopeSelector />
    </YStack>
  )
  const cadreSheetListFooter = cadreSheetFooter ?? <FeaturebaseFooterItems variant="button" />

  return (
    <>
      {floatingContent && (
        <View style={[styles.floatingActionLayer, layerHideStyle, { bottom: tabBarOffset + 12 }]} pointerEvents={hide ? 'none' : 'box-none'}>
          <XStack width="100%" paddingHorizontal={24} justifyContent="flex-end" pointerEvents="box-none">
            {floatingContent}
          </XStack>
        </View>
      )}

      <View style={styles.sheetLayer} pointerEvents="box-none">
        {hasCadreSheet && (
          <NavSheet
            ref={cadreSheetRef}
            onClose={() => setActiveSpecialTab(null)}
            items={cadreSheetItems}
            showLine
            ListHeaderComponent={cadreSheetListHeader}
            ListFooterComponent={cadreSheetListFooter}
            {...sheetProps}
          />
        )}
      </View>

      <View
        style={[styles.tabBarLayer, layerHideStyle]}
        pointerEvents={hide ? 'none' : 'box-none'}
        onLayout={(e) => setTabBarOffset(e.nativeEvent.layout.height)}
      >
        <LinearGradient
          colors={['transparent', colors.surfacePage]}
          start={[0, 0]}
          end={[0, 1]}
          style={[styles.gradientFooter, floatingContent ? styles.gradientFooterWithAction : null]}
          pointerEvents="box-none"
        >
          <TabBarInset paddingBottom={bottomInset}>
            <View style={[styles.pill, { backgroundColor: colors.surfaceSunken }]}>
              <View style={styles.tabsRow} accessibilityRole="tablist">
                <SelectionIndicator style={indicatorAnimatedStyle} fillColor={colors.selectionFill} />
                {items.map((item, index) => (
                  <MemoTab
                    key={item.id}
                    item={item}
                    isFocus={activeTabId === item.id}
                    isLast={index === items.length - 1}
                    onPress={handleTabPress}
                    onLayout={saveLayoutToRef}
                    inactiveColorVal={colors.inactiveColor}
                    badgeBgColor={colors.badgeRed}
                  />
                ))}
              </View>
            </View>
          </TabBarInset>
        </LinearGradient>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sheetLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, elevation: 10 },
  hiddenLayer: { opacity: 0, ...(isWeb ? { display: 'none' as const } : {}) },
  floatingActionLayer: { position: 'absolute', left: 0, right: 0, zIndex: 1, elevation: 1 },
  tabBarLayer: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100, elevation: 100 },
  gradientFooter: { width: '100%', paddingTop: layout.gradientHeight },
  gradientFooterWithAction: { paddingTop: 0 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.pillHeight,
    padding: layout.pillPadding,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    userSelect: 'none',
  },
  tabsRow: { flex: 1, flexDirection: 'row', alignItems: 'center', position: 'relative', height: layout.tabHeight, userSelect: 'none' },
  indicator: { position: 'absolute', top: 0, left: 0, height: layout.tabHeight, borderRadius: 999, overflow: 'hidden', zIndex: 0 },
  tabSlot: { flex: 1, height: layout.tabHeight, zIndex: 1 },
  tabSlotOverlap: { marginRight: -layout.tabOverlap },
  tabPressable: { flex: 1, height: layout.tabHeight, borderRadius: 999, alignItems: 'center', justifyContent: 'center', gap: 2, userSelect: 'none' },
  iconWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -8, alignItems: 'center', justifyContent: 'center' },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  badgeCount: { minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 4 },
  badgeText: { color: 'white', fontSize: 9, lineHeight: 12 },
})

export default FloatingTabBar
