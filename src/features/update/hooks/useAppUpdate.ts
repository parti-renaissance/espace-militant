import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'
import { checkVersion } from 'react-native-check-version'
import NetInfo from '@react-native-community/netinfo'
import { nativeApplicationVersion } from 'expo-application'
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync, useUpdates } from 'expo-updates'

import { ErrorMonitor } from '@/utils/ErrorMonitor'

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

  useEffect(() => {
    if (appHasStarted.current === false) {
      handleCallback(callback)
      appHasStarted.current = true
    }
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        handleCallback(callback)
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

  const runStoreUpdateCheck = useCallback(async () => {
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
  }, [])

  useAppStateOnChange(runStoreUpdateCheck)

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
  const isExpoCheckRunningRef = useRef(false)
  const didSkipExpoCheckDueToOfflineRef = useRef(false)
  const latestUpdateIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    latestUpdateIdRef.current = updatesState.availableUpdate?.updateId
  }, [updatesState.availableUpdate?.updateId])

  const runExpoUpdateCheck = useCallback(async () => {
    if (isExpoCheckRunningRef.current) {
      return
    }
    try {
      setIsError(null)
      // NetInfo can be null on cold start; only skip when explicitly offline.
      if (isConnected === false) {
        didSkipExpoCheckDueToOfflineRef.current = true
        setIsProcessing(false)
        return
      }
      didSkipExpoCheckDueToOfflineRef.current = false
      isExpoCheckRunningRef.current = true
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
          updateId: latestUpdateIdRef.current,
        })
      }
    } finally {
      isExpoCheckRunningRef.current = false
    }
  }, [isConnected])

  useAppStateOnChange(runExpoUpdateCheck)

  useEffect(() => {
    // Rerun only when we explicitly skipped because we were offline.
    if (isConnected === true && didSkipExpoCheckDueToOfflineRef.current && !isExpoCheckRunningRef.current) {
      handleCallback(runExpoUpdateCheck)
    }
  }, [isConnected, runExpoUpdateCheck])

  return {
    isAvailable: updatesState.isUpdateAvailable,
    isPending: updatesState.isChecking,
    isError: isError || updatesState.checkError || updatesState.downloadError,
    isProcessing: [updatesState.isDownloading, isProcessing].some(Boolean),
  }
}
