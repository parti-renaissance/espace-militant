/// <reference types="node" />
/* eslint-env node */
/* global console, process */
/* eslint-disable no-console */

import {exec} from 'child_process'
import {promisify} from 'util'
import chalk from 'chalk'
import appJson from '../../app.json' assert {type: 'json'}
import {fileURLToPath} from 'url'
import {program} from "commander";

/*

    This app simplify the build run instead of running it directly on bash
 */


const aExec = promisify(exec)
const candidate = appJson.expo.version

// Declare non available features un mJS
const __filename = fileURLToPath(import.meta.url)


async function actionHandler() {
  console.log('REF TYPE IS', process.env.REF_TYPE, '\n')
  console.log(chalk.magenta(`Will do an UPDATE on expo runtime version ${candidate}.`))
  const expoUpdateCommandBase = `eas update --auto`
  await aExec(expoUpdateCommandBase)
  process.exit(0)
}


program
    .description('This app simplify the build run instead of running it directly on bash')
    .action(actionHandler)
    .parse()
