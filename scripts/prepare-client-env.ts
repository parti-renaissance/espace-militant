import fs from 'fs/promises'
import path from 'path'
import { config } from 'dotenv'
import clientEnvSchema, { type ClientEnv } from '../client-env-schema'

config({ path: path.resolve(__dirname, '../.env') })
config({ path: path.resolve(__dirname, '../.env.local'), override: true })

const unParsedClientEnv = Object.entries(process.env)
  .filter(([key]) => key.startsWith('EXPO_PUBLIC_'))
  .reduce((acc, [key, value]) => {
    acc[key.replace('EXPO_PUBLIC_', '')] = value
    return acc
  }, {})

const clientEnv = clientEnvSchema.parse(unParsedClientEnv)

function generateClientEnvTsFileContent(clientEnv: ClientEnv) {
  return `
  import { Platform } from 'react-native'
  import { isEmulatorSync } from 'react-native-device-info'
  import type { ClientEnv } from '../../client-env-schema'

  const rawClientEnv: ClientEnv = ${JSON.stringify(clientEnv, null, 2)}

  const isAndroidEmulator = (): boolean => {
    try {
      return Platform.OS === 'android' && isEmulatorSync()
    } catch {
      return false
    }
  }

  const resolveLocalAndroidUrl = (value: string): string => {
    if (!__DEV__ || !isAndroidEmulator()) {
      return value
    }

    try {
      const url = new URL(value)
      if (!url.hostname.endsWith('.code')) {
        return value
      }

      const hasTrailingSlash = value.endsWith('/')
      url.hostname = '10.0.2.2'

      const nextValue = url.toString()
      return hasTrailingSlash ? nextValue : nextValue.replace(/\\/$/, '')
    } catch {
      return value
    }
  }

  const clientEnv: ClientEnv = {
    ...rawClientEnv,
    API_BASE_URL: resolveLocalAndroidUrl(rawClientEnv.API_BASE_URL),
    OAUTH_BASE_URL: resolveLocalAndroidUrl(rawClientEnv.OAUTH_BASE_URL),
  }

  export default clientEnv
  `
}

const pathToclientEnv = path.resolve(__dirname, '../src/config/clientEnv.ts')

fs.writeFile(pathToclientEnv, generateClientEnvTsFileContent(clientEnv), 'utf-8')
