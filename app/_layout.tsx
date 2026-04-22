import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { Slot, SplashScreen, useNavigationContainerRef } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { isWeb, TamaguiProvider, ViewProps } from 'tamagui'
import config from 'tamagui.config'
import { ToastProvider } from '@tamagui/toast'
import { isSupported } from '@firebase/messaging'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { PortalLayout } from '@/components/layouts/PortalLayout'
import WaitingScreen from '@/components/WaitingScreen'
import { useInitPushNotification } from '@/features/push-notification/hook'
import initRootAppNotification from '@/features/push-notification/logic/initRootAppNotification'
import { useCheckExpoUpdate, useCheckStoreUpdate } from '@/features/update/hooks/useAppUpdate'
import { UpdateExpoScreen, UpdateStoreScreen } from '@/features/update/updateScreen'

import { SessionProvider, useSession } from '@/ctx/SessionProvider'
import useDeepLinkHandler from '@/hooks/useDeepLinkHandler'
import useImportFont from '@/hooks/useImportFont'
import { useHits } from '@/services/hits/hook'
import { useInitMatomo } from '@/services/matomo/hook'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

if (isWeb) {
  require('@tamagui/core/reset.css')
}

isSupported().then(() => initRootAppNotification())

const { navigationIntegration } = ErrorMonitor.configure()

SplashScreen.preventAutoHideAsync()

const useRegisterRoutingInstrumentation = () => {
  const navigationRef = useNavigationContainerRef()

  useEffect(() => {
    if (navigationRef) {
      navigationIntegration.registerNavigationContainer(navigationRef)
    }
  }, [navigationRef])
}

const WaitingRoomHoc = (props: { children: ViewProps['children']; isLoading?: boolean }) => {
  useInitMatomo()
  useDeepLinkHandler()

  const { isLoading, isAuth } = useSession()
  const { trackActivitySession } = useHits()
  const didStartRef = useRef(false)
  const { isAvailable: isUpdateAvailable, isError: isUpdateError } = useCheckStoreUpdate()
  const { isAvailable: isExpoUpdateAvailable, isError: isExpoUpdateError, isProcessing: isExpoUpdateProcessing } = useCheckExpoUpdate()

  useInitPushNotification()

  if (!props.isLoading) {
    SplashScreen.hideAsync()
  }

  useEffect(() => {
    if (isAuth && !didStartRef.current) {
      didStartRef.current = true
      trackActivitySession()
    }
  }, [isAuth, trackActivitySession])

  if (isLoading) {
    return <WaitingScreen />
  }

  if (isUpdateAvailable && !isUpdateError) {
    return <UpdateStoreScreen />
  }

  if ((isExpoUpdateAvailable || isExpoUpdateProcessing) && !isExpoUpdateError) {
    return <UpdateExpoScreen />
  }

  return (
    <>
      {props.children}
      {(isLoading || props.isLoading) && (
        <>
          <BlurView
            blurMethod="dimezisBlurView"
            intensity={50}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1000,
            }}
          />
          <WaitingScreen />
        </>
      )}
    </>
  )
}

export const unstable_settings = {
  initialRouteName: '(app)',
}

function Root() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
          },
        },
      }),
  )
  const [isFontsLoaded] = useImportFont()
  useRegisterRoutingInstrumentation()

  return (
    <View style={isWeb ? { maxHeight: '100dvh' as any, flex: 1, backgroundColor: 'white' } : { flex: 1, backgroundColor: 'white' }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar animated style="dark" />
        <ToastProvider swipeDirection="up">
          <QueryClientProvider client={queryClient}>
            <TamaguiProvider config={config} defaultTheme="light">
              <ThemeProvider value={DefaultTheme}>
                <BottomSheetModalProvider>
                  <SessionProvider>
                    <PortalLayout>
                      <WaitingRoomHoc isLoading={!isFontsLoaded}>
                        <Slot />
                      </WaitingRoomHoc>
                    </PortalLayout>
                  </SessionProvider>
                </BottomSheetModalProvider>
              </ThemeProvider>
            </TamaguiProvider>
          </QueryClientProvider>
        </ToastProvider>
      </GestureHandlerRootView>
    </View>
  )
}

export default ErrorMonitor.wrap(Root)
