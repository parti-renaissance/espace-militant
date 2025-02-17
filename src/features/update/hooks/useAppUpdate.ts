import { useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import { checkVersion } from 'react-native-check-version'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import NetInfo from '@react-native-community/netinfo'
import { nativeApplicationVersion } from 'expo-application'
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync, useUpdates } from 'expo-updates'

const checkStoreUpdate = async () => {
  const version = await checkVersion({
    country: 'fr',
    bundleId: Platform.OS === 'android' ? 'fr.en_marche.jecoute' : 'fr.en-marche.jecoute',
    currentVersion: nativeApplicationVersion ?? '0.0.0',
  })

  return version
}

const handleCallback = async (callback: () => Promise<void>) => {
  return callback().catch((error) => {
    ErrorMonitor.log('AppStateOnChangeError', {
      message: error.message,
      stack: error.stack,
    })
  })
}

const useAppStateOnChange = (callback: () => Promise<void>) => {
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const appHasStarted = useRef(false)
  const callbackRef = useRef<Promise<void>>()

  useEffect(() => {
    if (appHasStarted.current === false) {
      callbackRef.current = callbackRef.current ?? handleCallback(callback) // avoid multiple calls
      appHasStarted.current = true
    }
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        callbackRef.current = handleCallback(callback)
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [callback])
}

export const useCheckStoreUpdate = () => {
  const [isPending, setIsPending] = useState(false)
  const [isBuildUpdateAvailable, setIsBuildUpdateAvailable] = useState(false)
  const [isError, setIsError] = useState<Error | null>(null)

  useAppStateOnChange(async () => {
    try {
      setIsPending(true)
      setIsError(null)
      const { needsUpdate } = await checkStoreUpdate()
      setIsPending(false)
      if (needsUpdate) {
        setIsBuildUpdateAvailable(true)
      }
    } catch (error) {
      setIsPending(false)
      setIsError(error)
      setIsBuildUpdateAvailable(false)
    }
  })

  return {
    isAvailable: isBuildUpdateAvailable,
    isPending: isPending,
    isError: isError,
  }
}

export const useCheckExpoUpdate = () => {
  const [isError, setIsError] = useState<Error | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { isConnected } = NetInfo.useNetInfo()
  const updatesState = useUpdates()
  useAppStateOnChange(async () => {
    try {
      setIsError(null)
      if (!isConnected) {
        setIsProcessing(false)
        return
      }
      const { isAvailable } = await checkForUpdateAsync()
      if (isAvailable) {
        setIsProcessing(true)
        await fetchUpdateAsync()
        await reloadAsync()
        setIsProcessing(false)
      }
    } catch (error) {
      setIsError(error)
      setIsProcessing(false)
      if (error instanceof Error) {
        ErrorMonitor.log('ErrorWhileUpdatingApp', {
          message: error.message,
          stack: error.stack,
          updateId: updatesState.availableUpdate?.updateId,
        })
      }
    }
  })

  return {
    isAvailable: updatesState.isUpdateAvailable,
    isPending: updatesState.isChecking,
    isError: isError || updatesState.checkError || updatesState.downloadError,
    isProcessing: [updatesState.isDownloading, isProcessing].some(Boolean),
  }
}
