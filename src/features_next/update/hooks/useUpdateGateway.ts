import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, Platform } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { checkVersion } from 'react-native-check-version'
import { nativeApplicationVersion } from 'expo-application'
import * as Updates from 'expo-updates'
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from 'expo-updates'

import redirectToStore from '@/helpers/redirectToStore'
import { ErrorMonitor } from '@/utils/ErrorMonitor'

const BOOT_CHECK_DELAY_MS = 1_000
const FOREGROUND_RECHECK_DELAY_MS = 2_000
const PREPARE_RELOAD_DELAY_MS = 400

export type OtaPhase = 'downloading' | 'preparing_reload' | 'reloading'
export type UpdateGatewayMode = 'ready' | 'store' | 'ota'

export type UpdateGatewayState = {
  mode: UpdateGatewayMode
  otaPhase: OtaPhase | null
  error: Error | null
  isStoreActionPending: boolean
  retry: () => void
  openStore: () => void
}

const isGatewaySupported = () => !__DEV__ && Platform.OS !== 'web'

const isOtaSupported = () => isGatewaySupported() && Updates.isEnabled

const checkStoreUpdate = async () => {
  const version = await checkVersion({
    country: 'fr',
    bundleId: Platform.OS === 'android' ? 'fr.en_marche.jecoute' : 'fr.en-marche.jecoute',
    currentVersion: nativeApplicationVersion ?? '0.0.0',
  })

  return version
}

const useUpdateGatewayProd = (): UpdateGatewayState => {
  const [mode, setMode] = useState<UpdateGatewayMode>('ready')
  const [otaPhase, setOtaPhase] = useState<OtaPhase | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isStoreActionPending, setIsStoreActionPending] = useState(false)
  const { isConnected } = NetInfo.useNetInfo()

  const modeRef = useRef(mode)
  const otaPhaseRef = useRef(otaPhase)
  const isPipelineRunningRef = useRef(false)
  const didSkipDueToOfflineRef = useRef(false)
  const hasBootCheckScheduledRef = useRef(false)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    otaPhaseRef.current = otaPhase
  }, [otaPhase])

  const waitBeforeReload = useCallback(
    () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, PREPARE_RELOAD_DELAY_MS)
      }),
    [],
  )

  const runOtaPipeline = useCallback(async () => {
    if (!isOtaSupported() || modeRef.current !== 'ready') {
      return
    }

    const checkResult = await checkForUpdateAsync()
    if (!checkResult.isAvailable) {
      return
    }

    setMode('ota')
    setOtaPhase('downloading')
    await fetchUpdateAsync()

    setOtaPhase('preparing_reload')
    await waitBeforeReload()

    setOtaPhase('reloading')
    await reloadAsync({
      reloadScreenOptions: {
        backgroundColor: '#ffffff',
        spinner: { color: '#0066CC' },
      },
    })
  }, [waitBeforeReload])

  const runStoreCheck = useCallback(async () => {
    if (!isGatewaySupported()) {
      return false
    }

    const { needsUpdate } = await checkStoreUpdate()
    if (needsUpdate) {
      setMode('store')
      setOtaPhase(null)
      setError(null)
      return true
    }

    return false
  }, [])

  const runGatewayChecks = useCallback(async () => {
    if (!isGatewaySupported()) {
      return
    }
    if (isPipelineRunningRef.current) {
      return
    }
    if (modeRef.current !== 'ready') {
      return
    }

    if (isConnected === false) {
      didSkipDueToOfflineRef.current = true
      return
    }

    didSkipDueToOfflineRef.current = false
    isPipelineRunningRef.current = true
    setError(null)

    try {
      const hasStoreUpdate = await runStoreCheck()
      if (hasStoreUpdate) {
        return
      }

      await runOtaPipeline()
    } catch (pipelineError) {
      const normalizedError = pipelineError instanceof Error ? pipelineError : new Error(String(pipelineError))
      setError(normalizedError)
      setMode('ready')
      setOtaPhase(null)
      ErrorMonitor.log('ErrorWhileUpdatingApp', {
        message: normalizedError.message,
        stack: normalizedError.stack,
        mode: modeRef.current,
        phase: otaPhaseRef.current,
      })
    } finally {
      isPipelineRunningRef.current = false
    }
  }, [isConnected, runOtaPipeline, runStoreCheck])

  const runGatewayChecksRef = useRef(runGatewayChecks)
  useEffect(() => {
    runGatewayChecksRef.current = runGatewayChecks
  }, [runGatewayChecks])

  const retry = useCallback(() => {
    setError(null)
    void runGatewayChecksRef.current()
  }, [])

  const openStore = useCallback(() => {
    setIsStoreActionPending(true)
    void redirectToStore()
      .catch((storeError) => {
        const normalizedError = storeError instanceof Error ? storeError : new Error(String(storeError))
        setError(normalizedError)
        ErrorMonitor.log('ErrorWhileOpeningStore', {
          message: normalizedError.message,
          stack: normalizedError.stack,
        })
      })
      .finally(() => {
        setIsStoreActionPending(false)
      })
  }, [])

  useEffect(() => {
    if (!isGatewaySupported() || hasBootCheckScheduledRef.current) {
      return
    }
    hasBootCheckScheduledRef.current = true

    const timer = setTimeout(() => {
      void runGatewayChecksRef.current()
    }, BOOT_CHECK_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let foregroundTimer: ReturnType<typeof setTimeout> | undefined

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setIsStoreActionPending(false)
      }

      if (foregroundTimer) {
        clearTimeout(foregroundTimer)
        foregroundTimer = undefined
      }

      if (nextAppState !== 'active' || modeRef.current !== 'ready') {
        return
      }

      foregroundTimer = setTimeout(() => {
        if (modeRef.current === 'ready' && !isPipelineRunningRef.current) {
          void runGatewayChecksRef.current()
        }
      }, FOREGROUND_RECHECK_DELAY_MS)
    })

    return () => {
      if (foregroundTimer) {
        clearTimeout(foregroundTimer)
      }
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    if (isConnected === true && didSkipDueToOfflineRef.current && modeRef.current === 'ready' && !isPipelineRunningRef.current) {
      void runGatewayChecksRef.current()
    }
  }, [isConnected])

  return {
    mode,
    otaPhase,
    error,
    isStoreActionPending,
    retry,
    openStore,
  }
}

const useUpdateGatewayDev = (): UpdateGatewayState => ({
  mode: 'ready',
  otaPhase: null,
  error: null,
  isStoreActionPending: false,
  retry: () => undefined,
  openStore: () => undefined,
})

export const useUpdateGateway = __DEV__ ? useUpdateGatewayDev : useUpdateGatewayProd
