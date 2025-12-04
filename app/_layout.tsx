import React, { useEffect, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import WaitingScreen from '@/components/WaitingScreen'
import { SessionProvider, useSession } from '@/ctx/SessionProvider'
import { useInitMatomo } from '@/services/matomo/hook'
import { useInitPushNotification } from '@/features/push-notification/hook'
import initRootAppNotification from '@/features/push-notification/logic/initRootAppNotification'
import { useCheckExpoUpdate, useCheckStoreUpdate } from '@/features/update/hooks/useAppUpdate'
import { UpdateExpoScreen, UpdateStoreScreen } from '@/features/update/updateScreen'
import useDeepLinkHandler from '@/hooks/useDeepLinkHandler'
import useImportFont from '@/hooks/useImportFont'
import { TamaguiProvider } from 'tamagui'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { isSupported } from '@firebase/messaging'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { ToastProvider } from '@tamagui/toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlurView } from 'expo-blur'
import { Slot, SplashScreen, useNavigationContainerRef } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { isWeb, ViewProps } from 'tamagui'
import { useHits } from '@/services/hits/hook'
import config from 'tamagui.config'

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
            experimentalBlurMethod="dimezisBlurView"
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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
      },
    },
  })
  const [isFontsLoaded] = useImportFont()
  useRegisterRoutingInstrumentation()

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar animated style="dark" />
      <ToastProvider swipeDirection="up">
        <QueryClientProvider client={queryClient}>
          <TamaguiProvider config={config} defaultTheme="light">
            <ThemeProvider value={DefaultTheme}>
              <BottomSheetModalProvider>
                <SessionProvider>
                  <WaitingRoomHoc isLoading={!isFontsLoaded}>
                    <Slot />
                  </WaitingRoomHoc>
                </SessionProvider>
              </BottomSheetModalProvider>
            </ThemeProvider>
          </TamaguiProvider>
        </QueryClientProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  )
}

export default ErrorMonitor.wrap(Root)
