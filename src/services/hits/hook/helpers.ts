import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { format } from 'date-fns'
import * as Crypto from 'expo-crypto'

export function formatLocalISO(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx")
}

export function getAppVersionTag(): string {
  const version = Constants.expoConfig?.version ?? '0.0.0'
  const build = (Constants.expoConfig?.extra)?.eas_update_version ?? '0'
  return `${version}#${build}`
}

export function getAppSystem(): 'ios' | 'android' | 'web' {
  if (Platform.OS === 'ios') return 'ios'
  if (Platform.OS === 'android') return 'android'
  return 'web'
}

export function getUserAgentSafe(): string | undefined {
  if (Platform.OS === 'web') {
    return typeof navigator !== 'undefined' ? navigator.userAgent : undefined
  }
  const brand = Device.brand ?? 'unknown'
  const model = Device.modelName ?? 'unknown'
  const os = `${Platform.OS} ${Device.osVersion ?? ''}`.trim()
  const app = `${Constants.expoConfig?.name ?? 'app'}/${getAppVersionTag()}`
  return `${app}; ${brand}; ${model}; ${os}`
}

export function generateUuid(): string {
  return Crypto.randomUUID()
}
