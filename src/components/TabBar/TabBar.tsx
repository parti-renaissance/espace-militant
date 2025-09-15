import React, { useMemo, useRef } from 'react'
import { LayoutChangeEvent, LayoutRectangle, Platform, SafeAreaView as RNSafeAreaView, StyleSheet } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import Text from '@/components/base/Text'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { MoreHorizontal, QrCode } from '@tamagui/lucide-icons'
import { getThemes, isWeb, styled, ThemeableStack, withStaticProperties, XStack } from 'tamagui'
import MoreSheet from './MoreSheet'
import { TabBarNavProps, TabNavOptions } from './types'
import clientEnv from '@/config/clientEnv'
import FutureButton from '../Buttons/FutureButton'
import { useGetUserScopes } from '@/services/profile/hook'

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

const TabBar = withStaticProperties(TabBarFrame, {
  Tab: TabFrame,
})

type TabProps = {
  name: string
  isFocus: boolean
  onPress: () => void
  options: TabNavOptions
  onLayout: (e: LayoutChangeEvent) => void
}

const Tab = ({ isFocus, options, name, onPress, onLayout }: TabProps) => {
  const scale = useSharedValue(0)

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

  const activeColor = (isFocus ? options.tabBarActiveTintColor : options.tabBarInactiveTintColor) ?? 'black'
  const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : name
  const tabBarIcon = options.tabBarIcon ? (
    <Animated.View style={[animatedIconStyle]}>
      <options.tabBarIcon color={activeColor} size={16} focused={isFocus} />
    </Animated.View>
  ) : null
  return (
    <TabBar.Tab theme={options.tabBarTheme} onPress={handlePress} group onLayout={onLayout} flex={1} width={50}>
      {tabBarIcon}
      <Animated.View style={[animatedTextStyle]}>
        <Text.XSM semibold color={activeColor}>
          {label}
        </Text.XSM>
      </Animated.View>
    </TabBar.Tab>
  )
}
const MemoTab = React.memo(Tab)

const TabBarNav = ({ state, descriptors, navigation, hide }: TabBarNavProps) => {
  const [otherFocus, setOtherFocus] = React.useState(false)
  const { data: scopes } = useGetUserScopes()

  const hasScannerScope = useMemo(() => scopes?.some((scope) => scope.code === 'meeting_scanner'), [scopes])
  
  const isOnHomeRoute = useMemo(() => {
    const currentRoute = state.routes[state.index]
    return currentRoute?.name === '(home)'
  }, [state.routes, state.index])

  const filteredRoutes = React.useMemo(
    () =>
      state.routes.filter((route) => {
        const { options } = descriptors[route.key]
        return options.tabBarVisible === true || options.tabBarVisible === undefined
      }),
    [state.routes, descriptors],
  )

  const otherIsFocus = otherFocus || state.index > filteredRoutes.length - 1

  const hiddenRoutes = React.useMemo(
    () =>
      state.routes.filter((route) => {
        const { options } = descriptors[route.key]
        return options.tabBarVisible === false && !options?.disabled
      }),
    [state.routes, descriptors],
  )

  const layoutsByKey = useRef(new Map<string, LayoutRectangle>())
  const getPosition = (layout: LayoutRectangle) => {
    return layout.x + layout?.width / 2 - (isWeb ? 50 : 27)
  }

  const getPositionFromKey = (routeKey: string) => {
    const layout = layoutsByKey.current.get(routeKey)
    if (!layout) return 0
    return getPosition(layout)
  }
  const themes = getThemes()
  const tabTheme = (state.index < filteredRoutes.length ? descriptors[state.routes[state.index].key].options.tabBarTheme : 'gray') ?? 'gray'
  const activeColorValue = themes.light[`${tabTheme}1`].val

  const position = useSharedValue(0)
  const activeColor = useSharedValue(activeColorValue)

  React.useEffect(() => {
    activeColor.value = activeColorValue
  }, [activeColorValue])

  React.useEffect(() => {
    const key = state.index > filteredRoutes.length - 1 ? 'more' : state.routes[state.index].key
    if (otherIsFocus) {
      return
    }
    position.value = withSpring(getPositionFromKey(key), springConfig)
    setTimeout(() => {
      activeColor.value = activeColorValue
    }, 100)
  }, [state.index, otherIsFocus])

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
      backgroundColor: activeColor.value,
    }
  })

  const handleSaveLayout = (key: string) => (e: LayoutChangeEvent) => {
    if (layoutsByKey.current) {
      if (key === state.routes[state.index].key) {
        position.value = getPosition(e.nativeEvent.layout)
      }
      layoutsByKey.current.set(key, e.nativeEvent.layout)
    }
  }

  const moreSheetRef = useRef<BottomSheet>(null)

  const handleMoreClose = () => {
    setOtherFocus(false)
  }

  const handleOtherPress = () => {
    setOtherFocus((x) => {
      if (x) {
        moreSheetRef.current?.close()
      } else {
        moreSheetRef.current?.expand()
        position.value = withSpring(getPositionFromKey('more'), springConfig)
        activeColor.value = themes.light[`gray1`].val
      }
      return !x
    })
  }
  if (hide) return null
  return (
    <>
      <SAV {...SAVProps} style={{ backgroundColor: 'white' }}>

        {hasScannerScope && isOnHomeRoute ? (
          <XStack zIndex={1000} height={58 + 16 + 16} position="absolute" top={-58 - 8 - 16 - 16} right={0} left={0} bottom={0} pointerEvents="box-none" justifyContent="center" alignItems="center">
            <XStack padding={16} backgroundColor="#290A4299" borderRadius={999} pointerEvents="auto">
              <FutureButton onPress={() => navigation.navigate('scanner')}>
                <XStack alignItems="center" gap={8}>
                  <QrCode size={20} color="white" />
                  <Text.LG regular color="white">Scanner un billet</Text.LG>
                </XStack>
              </FutureButton>
            </XStack>
          </XStack>
        ) : null}
        <TabBar>
          <Animated.View style={[indicatorStyle.indicator, indicatorAnimatedStyle]} />
          {filteredRoutes.map((route, index) => {
            const { options } = descriptors[route.key]
            const isFocus = state.index === index && !otherIsFocus
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })
              moreSheetRef.current?.close()
              setOtherFocus(false)
              position.value = withSpring(getPositionFromKey(route.key), springConfig)
              activeColor.value = themes.light[`${options.tabBarTheme}1`].val

              if (!isFocus && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            return <MemoTab onLayout={handleSaveLayout(route.key)} key={route.name} name={route.name} isFocus={isFocus} onPress={onPress} options={options} />
          })}
          <MemoTab
            name="more"
            isFocus={otherIsFocus}
            onPress={handleOtherPress}
            options={{
              tabBarVisible: true,
              tabBarTheme: 'gray',
              tabBarActiveTintColor: '$color5',
              tabBarInactiveTintColor: '$textPrimary',
              tabBarIcon: ({ focused, ...props }) => <MoreHorizontal {...props} />,
              tabBarLabel: 'Autre',
            }}
            onLayout={handleSaveLayout('more')}
          />
        </TabBar>
      </SAV>
      <MoreSheet
        ref={moreSheetRef}
        onClose={handleMoreClose}
        navProps={{
          state: { ...state, routes: hiddenRoutes },
          descriptors,
          navigation,
          mainNavLength: filteredRoutes.length,
        }}
      />
    </>
  )
}

export default TabBarNav
