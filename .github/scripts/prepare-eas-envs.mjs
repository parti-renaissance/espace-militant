/// <reference types="node" />
/* eslint-env node */
/* global console, process */
/* eslint-disable no-console */

import { promises as fs } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const profile = process.env.EAS_BUILD_PROFILE

const easJsonPath = path.resolve(__dirname, './../../eas.json')
const getEnvs = () => {
  const envs = {}
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('EXPO_PUBLIC_')) {
      envs[key] = process.env[key]
    }
  })
  return envs
}

/*
 * function that take all var that begin with EXPO_PUBLIC_ and add them to eas.json file
 */
const addEnvsToEasJson = async () => {
  const easJsonContent = await fs.readFile(easJsonPath, 'utf8')
  const easJson = JSON.parse(easJsonContent)
  const currentEnvs = easJson.build[profile].env ?? {}
  easJson.build[profile].env = {
    ...currentEnvs,
    ...getEnvs(),
  }
  await fs.writeFile(easJsonPath, JSON.stringify(easJson, null, 2))
  console.log(`Added envs to eas.json`)
}

if (!profile) {
  console.warn('No EAS_BUILD_PROFILE provided, skipping adding envs to eas.json')
  throw new Error('No EAS_BUILD_PROFILE provided')
}
await addEnvsToEasJson()
