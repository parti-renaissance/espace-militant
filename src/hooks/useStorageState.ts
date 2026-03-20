import * as React from 'react'
import { Platform } from 'react-native'
import LocalStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import useAsyncState, { UseStateHook } from './useAsyncState'

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, value)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Local storage is unavailable:', e)
    }
  } else if (value == null) {
    await SecureStore.deleteItemAsync(key)
  } else {
    await SecureStore.setItemAsync(key, value)
  }
}

export async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Local storage is unavailable:', e)
    }
  } else {
    return SecureStore.getItemAsync(key)
  }

  return null
}

export async function removeStorageItemAsync(key: string) {
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Local storage is unavailable:', e)
    }
  } else {
    SecureStore.deleteItemAsync(key)
  }
}

export const AsyncStorage = {
  secure: {
    setItem: setStorageItemAsync,
    getItem: getStorageItemAsync,
    removeItem: removeStorageItemAsync,
  },
  ...LocalStorage,
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>()

  // Get
  React.useEffect(() => {
    AsyncStorage.secure.getItem(key).then((value) => {
      setState(value)
    })
  }, [key])

  // Set
  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value)
      setStorageItemAsync(key, value)
    },
    [key, setState],
  )

  return [state, setValue]
}
