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
  import type { ClientEnv } from '../../client-env-schema'
  const clientEnv:ClientEnv = ${JSON.stringify(clientEnv, null, 2)}
  export default clientEnv
  `
}

const pathToclientEnv = path.resolve(__dirname, '../src/config/clientEnv.ts')

fs.writeFile(pathToclientEnv, generateClientEnvTsFileContent(clientEnv), 'utf-8')
