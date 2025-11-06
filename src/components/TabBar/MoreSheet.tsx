import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GoToAdminCard as _GoToAdminCard } from '@/components/ProfileCards/ProfileCard/MyProfileCard'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useGetProfil } from '@/services/profile/hook'
import { useUserStore } from '@/store/user-store'
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet'
import Menu from '../menu/Menu'
import { TabBarNavProps } from './types'
import { ROUTES } from '@/config/routes'

const GoToAdminCard = () => {
  const { user: session } = useUserStore()
  const user = useGetProfil({ enabled: !!session })
  const profile = user?.data
  if (!profile) return null
  return <_GoToAdminCard profil={profile} />
}

const MoreSheet = forwardRef<
  {
    expand: () => void
    close: () => void
  },
  {
    onClose?: () => void
    navProps: {
      state: TabBarNavProps['state']
      descriptors: TabBarNavProps['descriptors']
      navigation: TabBarNavProps['navigation']
      mainNavLength: number
    }
  }
>(({ onClose, navProps }, ref) => {
  const insets = useSafeAreaInsets()
  const bsRef = useRef<BottomSheet>(null)
  const zIndex = useSharedValue(-10)

  const handleClose = useCallback(() => {
    onClose?.()
    zIndex.value = -10
  }, [onClose])

  useImperativeHandle(ref, () => {
    return {
      expand: () => {
        bsRef.current?.expand()
        zIndex.value = 10
      },
      close: () => {
        bsRef.current?.close()
        zIndex.value = -10
      },
    }
  })

  const styleContainer = useAnimatedStyle(() => {
    return {
      zIndex: zIndex.value,
    }
  })
  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, [])
  return (
    <Animated.View style={[styles.container, { bottom: 54 + insets.bottom + 9 }, styleContainer]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheet
          ref={bsRef}
          index={-1}
          backdropComponent={renderBackdrop}
          onClose={handleClose}
          enablePanDownToClose
          handleIndicatorStyle={{
            backgroundColor: '#D2DCE5',
            width: 48,
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <VoxCard.Content>
              <GoToAdminCard />
            </VoxCard.Content>
            <Menu>
              {navProps.state.routes.map((route, index) => {
                const { options } = navProps.descriptors[route.key]
                const routeConfig = ROUTES.find(r => r.name === route.name)
                const label = options.tabBarLabel ?? options.title ?? route.name
                
                const handlePress = () => {
                  if (!routeConfig?.externalSlug) {
                    navProps.navigation.navigate(route.name)
                  }
                  bsRef.current?.close()
                }
                
                return (
                  <Menu.Item
                    key={route.key}
                    size="lg"
                    showArrow
                    active={navProps.state.index === index + navProps.mainNavLength}
                    // @ts-expect-error icon is not in the type
                    icon={options.tabBarIcon}
                    onPress={handlePress}
                    externalSlug={routeConfig?.externalSlug}
                  >
                    {label}
                  </Menu.Item>
                )
              })}
            </Menu>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    pointerEvents: 'box-none',
    top: 0,
    left: 0,
    right: 0,
    bottom: 54,
  },
  contentContainer: {
    width: '100%',
  },
})

export default MoreSheet
