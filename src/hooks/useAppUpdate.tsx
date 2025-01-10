import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { checkVersion } from 'react-native-check-version'
import { ErrorMonitor } from '@/utils/ErrorMonitor'
import { nativeApplicationVersion } from 'expo-application'
import { checkForUpdateAsync, fetchUpdateAsync, useUpdates } from 'expo-updates'
import { isWeb } from 'tamagui'

export default function useAppUpdate() {
  const updates = useUpdates()
  const [isBuildUpdateAvailable, setIsBuildUpdateAvailable] = useState(false)

  const checkForUpdate = () => {
    if (isWeb || __DEV__) {
      return
    }

    const checkStoreUpdate = async () => {
      const version = await checkVersion({
        country: 'fr',
        bundleId: Platform.OS === 'android' ? 'fr.en_marche.jecoute' : 'fr.en-marche.jecoute',
        currentVersion: nativeApplicationVersion ?? '999',
      })

      if (version.needsUpdate) {
        setIsBuildUpdateAvailable(true)
      }
    }

    const checkExpoUpdate = async () => {
      try {
        const update = await checkForUpdateAsync()

        if (update.isAvailable) {
          await fetchUpdateAsync()
        }
        return update.isAvailable
      } catch (error) {
        ErrorMonitor.log('Expo update failed', error)
      }
    }

    return Promise.allSettled([checkExpoUpdate(), checkStoreUpdate()])
  }

  useEffect(() => {
    checkForUpdate()
  }, [])

  return {
    isBuildUpdateAvailable,
    checkForUpdate,
    ...updates,
  }
}
