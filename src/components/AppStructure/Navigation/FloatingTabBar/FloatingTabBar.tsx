import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle, Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { type AnimatedStyle, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import type { ViewStyle } from 'react-native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getThemes, isWeb, XStack, YStack } from 'tamagui'

import NavSheet, { type NavSheetRef } from '@/components/AppStructure/Navigation/NavSheet'
import { FeaturebaseFooterItems } from '@/components/AppStructure/Navigation/FeaturebaseFooterItems'
import { ScopeSelector } from '@/components/AppStructure/Navigation/ScopeSelector'
import Text from '@/components/base/Text'
import type { NavItemConfig } from '@/config/navigationItems'
import type { IconComponent } from '@/models/common.model'

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
  onTabPress?: (id: string) => void
  moreSheetItems?: NavItemConfig[]
  cadreSheetItems?: NavItemConfig[]
  cadreSheetHeader?: React.ReactNode
  cadreSheetFooter?: React.ReactNode
  floatingContent?: React.ReactNode
  hide?: boolean
}

const springConfig = {
  duration: 350,
  dampingRatio: 0.75,
}

const SURFACE_SUNKEN = '#F6F0EA'
const SURFACE_PAGE = '#FAF7F4'
const SELECTION_FILL = '#FBF9F7'
const PILL_BORDER = 'rgba(255, 255, 255, 0.85)'
const TAB_HEIGHT = 56
const PILL_PADDING = 4
const TAB_OVERLAP = 8
const BOTTOM_PADDING = 24
const GRADIENT_FOOTER_PADDING_TOP = 48

const estimateTabBarLayerHeight = (bottomInset: number, hasFloatingContent: boolean) =>
  FLOATING_TAB_BAR_PILL_HEIGHT + Math.max(BOTTOM_PADDING, bottomInset) + (hasFloatingContent ? 0 : GRADIENT_FOOTER_PADDING_TOP)

export const FLOATING_TAB_BAR_PILL_HEIGHT = TAB_HEIGHT + PILL_PADDING * 2
export const FLOATING_TAB_BAR_BOTTOM_PADDING = BOTTOM_PADDING
export const FLOATING_TAB_BAR_DEFAULT_OFFSET = FLOATING_TAB_BAR_BOTTOM_PADDING + FLOATING_TAB_BAR_PILL_HEIGHT
export const FLOATING_TAB_BAR_Z_INDEX = 100
export const FLOATING_ACTION_Z_INDEX = 1

type TabProps = {
  item: FloatingTabBarItem
  isFocus: boolean
  isLast: boolean
  onPressRef: React.MutableRefObject<((id: string) => void) | null>
  onLayoutRef: React.MutableRefObject<((key: string, layout: LayoutRectangle) => void) | null>
  inactiveColorVal: string
}

const TabBadge = ({ badge }: { badge: number | boolean }) => {
  const isDot = badge === true
  const label = typeof badge === 'number' ? (badge > 9 ? '9+' : String(badge)) : null

  return (
    <View style={[styles.badge, isDot ? styles.badgeDot : styles.badgeCount]}>
      {!isDot && label ? (
        <Text style={styles.badgeText} semibold>
          {label}
        </Text>
      ) : null}
    </View>
  )
}

const Tab = ({ item, isFocus, isLast, onPressRef, onLayoutRef, inactiveColorVal }: TabProps) => {
  const { id, label, icon: Icon, theme = 'blue', badge } = item
  const themes = getThemes()
  const activeColor = themes.light[`${theme}5`]?.val ?? themes.light.blue5?.val ?? '#0094FF'
  const color = isFocus ? activeColor : inactiveColorVal

  const onPress = useCallback(() => {
    onPressRef.current?.(id)
  }, [id, onPressRef])

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      onLayoutRef.current?.(id, e.nativeEvent.layout)
    },
    [id, onLayoutRef],
  )

  return (
    <View style={[styles.tabSlot, !isLast && styles.tabSlotOverlap]} onLayout={onLayout}>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.tabPressable}>
        <View style={styles.iconWrapper}>
          {Icon ? <Icon color={color} size={20} /> : null}
          {badge != null ? <TabBadge badge={badge} /> : null}
        </View>
        <Text.XSM semibold color={color} textAlign="center" {...(isWeb ? { userSelect: 'none' } : {})}>
          {label}
        </Text.XSM>
      </Pressable>
    </View>
  )
}

const MemoTab = React.memo(Tab)

const SelectionIndicator = ({ style }: { style: AnimatedStyle<ViewStyle> }) => {
  if (isWeb) {
    return <Animated.View style={[styles.indicator, { backgroundColor: SELECTION_FILL }, style]} pointerEvents="none" />
  }

  return (
    <Animated.View style={[styles.indicator, style]} pointerEvents="none">
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.selectionOverlay]} />
    </Animated.View>
  )
}

export const FloatingTabBar = ({
  items,
  initialActiveId,
  onTabPress,
  moreSheetItems = [],
  cadreSheetItems = [],
  cadreSheetHeader,
  cadreSheetFooter,
  floatingContent,
  hide = false,
}: FloatingTabBarProps) => {
  const themes = getThemes()
  const inactiveColor = themes.light.textSecondary.val
  const insets = useSafeAreaInsets()
  const layoutsByKey = useRef(new Map<string, LayoutRectangle>())
  const position = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)

  const [activeRouteId, setActiveRouteId] = useState(initialActiveId ?? items[0]?.id ?? '')
  const [activeSpecialTab, setActiveSpecialTab] = useState<string | null>(null)
  const [tabBarOffset, setTabBarOffset] = useState(() => estimateTabBarLayerHeight(insets.bottom, Boolean(floatingContent)))

  const moreSheetRef = useRef<NavSheetRef>(null)
  const cadreSheetRef = useRef<NavSheetRef>(null)

  const sheetRefs = useMemo(
    () =>
      ({
        more: moreSheetRef,
        cadreSheet: cadreSheetRef,
      }) as Record<string, React.RefObject<NavSheetRef | null>>,
    [],
  )

  const activeTabId = activeSpecialTab ?? activeRouteId

  const sheetProps = useMemo(
    () => ({
      behindTabBar: true as const,
      tabBarOffset,
    }),
    [tabBarOffset],
  )

  const cadreSheetListHeader =
    cadreSheetHeader ?? (
      <YStack paddingHorizontal={16} marginBottom={12}>
        <ScopeSelector />
      </YStack>
    )

  const cadreSheetListFooter = cadreSheetFooter ?? <FeaturebaseFooterItems variant="button" />

  const hasMoreSheet = items.some((item) => item.id === 'more') && moreSheetItems.length > 0
  const hasCadreSheet = items.some((item) => item.id === 'cadreSheet') && cadreSheetItems.length > 0

  const applyIndicatorLayout = useCallback(
    (layout: LayoutRectangle, animate: boolean) => {
      if (animate) {
        position.value = withSpring(layout.x, springConfig)
        indicatorWidth.value = withSpring(layout.width, springConfig)
        return
      }
      position.value = layout.x
      indicatorWidth.value = layout.width
    },
    [indicatorWidth, position],
  )

  const animateToTab = useCallback(
    (tabId: string) => {
      const layout = layoutsByKey.current.get(tabId)
      if (!layout) return
      applyIndicatorLayout(layout, true)
    },
    [applyIndicatorLayout],
  )

  const closeAllSheets = useCallback(() => {
    moreSheetRef.current?.close()
    cadreSheetRef.current?.close()
  }, [])

  const handleSheetClose = useCallback((id?: string) => {
    setActiveSpecialTab((current) => (current === id ? null : current))
  }, [])

  const handleTabPress = useCallback(
    (id: string) => {
      const targetSheet = sheetRefs[id]

      if (targetSheet && (id === 'more' ? hasMoreSheet : hasCadreSheet)) {
        if (activeSpecialTab === id) {
          targetSheet.current?.close()
          setActiveSpecialTab(null)
          return
        }
        if (activeSpecialTab && sheetRefs[activeSpecialTab]) {
          sheetRefs[activeSpecialTab].current?.close()
          targetSheet.current?.expand()
          setActiveSpecialTab(id)
          animateToTab(id)
          return
        }
        targetSheet.current?.expand()
        setActiveSpecialTab(id)
        animateToTab(id)
        return
      }

      closeAllSheets()
      setActiveSpecialTab(null)
      if (id === activeRouteId) return

      setActiveRouteId(id)
      animateToTab(id)
      onTabPress?.(id)
    },
    [activeRouteId, activeSpecialTab, animateToTab, closeAllSheets, hasCadreSheet, hasMoreSheet, onTabPress, sheetRefs],
  )

  const handleTabPressRef = useRef(handleTabPress)
  useLayoutEffect(() => {
    handleTabPressRef.current = handleTabPress
  }, [handleTabPress])

  const saveLayoutToRef = useCallback(
    (key: string, layout: LayoutRectangle) => {
      layoutsByKey.current.set(key, layout)
      if (key === activeTabId) {
        applyIndicatorLayout(layout, false)
      }
    },
    [activeTabId, applyIndicatorLayout],
  )
  const handleSaveLayoutRef = useRef(saveLayoutToRef)
  useLayoutEffect(() => {
    handleSaveLayoutRef.current = saveLayoutToRef
  }, [saveLayoutToRef])

  React.useEffect(() => {
    animateToTab(activeTabId)
  }, [activeTabId, animateToTab])

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    left: position.value,
    width: indicatorWidth.value,
  }))

  const handleTabBarAreaLayout = useCallback((e: LayoutChangeEvent) => {
    setTabBarOffset(e.nativeEvent.layout.height)
  }, [])

  if (hide) return null

  return (
    <>
      {hasMoreSheet ? (
        <NavSheet ref={moreSheetRef} onClose={() => handleSheetClose('more')} items={moreSheetItems} {...sheetProps} />
      ) : null}

      {hasCadreSheet ? (
        <NavSheet
          ref={cadreSheetRef}
          onClose={() => handleSheetClose('cadreSheet')}
          items={cadreSheetItems}
          showLine
          ListHeaderComponent={cadreSheetListHeader}
          ListFooterComponent={cadreSheetListFooter}
          {...sheetProps}
        />
      ) : null}

      {floatingContent ? (
        <View style={[styles.floatingActionLayer, { bottom: tabBarOffset + 12 }]} pointerEvents="box-none">
          <XStack width="100%" paddingHorizontal={24} justifyContent="flex-end" pointerEvents="box-none">
            {floatingContent}
          </XStack>
        </View>
      ) : null}

      <View style={styles.tabBarLayer} pointerEvents="box-none" onLayout={handleTabBarAreaLayout}>
        <LinearGradient
          colors={['rgba(250, 247, 244, 0)', SURFACE_PAGE]}
          start={[0, 0]}
          end={[0, 1]}
          style={[styles.gradientFooter, floatingContent ? styles.gradientFooterWithAction : null]}
          pointerEvents="box-none"
        >
          <YStack
            width="100%"
            paddingHorizontal={24}
            paddingBottom={Math.max(BOTTOM_PADDING, insets.bottom)}
            pointerEvents="box-none"
          >
            <View style={styles.pill}>
              <View style={styles.tabsRow}>
                <SelectionIndicator style={indicatorAnimatedStyle} />
                {items.map((item, index) => (
                  <MemoTab
                    key={item.id}
                    item={item}
                    isFocus={activeTabId === item.id}
                    isLast={index === items.length - 1}
                    onPressRef={handleTabPressRef}
                    onLayoutRef={handleSaveLayoutRef}
                    inactiveColorVal={inactiveColor}
                  />
                ))}
              </View>
            </View>
          </YStack>
        </LinearGradient>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  floatingActionLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: FLOATING_ACTION_Z_INDEX,
    elevation: FLOATING_ACTION_Z_INDEX,
  },
  tabBarLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: FLOATING_TAB_BAR_Z_INDEX,
    elevation: FLOATING_TAB_BAR_Z_INDEX,
  },
  gradientFooter: {
    width: '100%',
    paddingTop: GRADIENT_FOOTER_PADDING_TOP,
  },
  gradientFooterWithAction: {
    paddingTop: 0,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TAB_HEIGHT + PILL_PADDING * 2,
    padding: PILL_PADDING,
    borderRadius: 999,
    backgroundColor: SURFACE_SUNKEN,
    borderWidth: 1,
    borderColor: PILL_BORDER,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    userSelect: 'none',
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: TAB_HEIGHT,
    userSelect: 'none',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: TAB_HEIGHT,
    borderRadius: 999,
    overflow: 'hidden',
    zIndex: 0,
  },
  tabSlot: {
    flex: 1,
    height: TAB_HEIGHT,
    zIndex: 1,
  },
  tabSlotOverlap: {
    marginRight: -TAB_OVERLAP,
  },
  tabPressable: {
    flex: 1,
    height: TAB_HEIGHT,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    userSelect: 'none',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -8,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeCount: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    lineHeight: 12,
  },
  selectionOverlay: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(251, 249, 247, 0.75)' : SELECTION_FILL,
  },
})

export default FloatingTabBar
