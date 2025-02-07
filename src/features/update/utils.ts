import { Platform } from 'react-native'
import { checkVersion } from 'react-native-check-version'
import { nativeApplicationVersion } from 'expo-application'

export const checkStoreUpdate = async () => {
  const version = await checkVersion({
    country: 'fr',
    bundleId: Platform.OS === 'android' ? 'fr.en_marche.jecoute' : 'fr.en-marche.jecoute',
    currentVersion: nativeApplicationVersion ?? '999',
  })

  return version.needsUpdate
}
