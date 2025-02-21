/// <reference types="node" />
/* eslint-env node */
/* global console, process */
/* eslint-disable no-console */

import {exec} from 'child_process'
import {promisify} from 'util'
import chalk from 'chalk'
import appJson from '../../app.json' assert {type: 'json'}
import {program} from "commander";

/*

    This app simplify the build run instead of running it directly on bash
 */


const aExec = promisify(exec)
const candidate = appJson.expo.version


async function actionHandler() {
  try {
    if (!process.env.PLATFORM) {
      console.log(chalk.red('PLATFORM is not defined'))
      process.exit(2)
    }
    const platform = ['ios', 'android'].includes(process.env.PLATFORM) ? process.env.PLATFORM : 'all'

    console.log('REF TYPE IS', process.env.REF_TYPE, '\n')
    switch (process.env.EAS_WORKFLOW_TYPE) {
      case 'update': {
          console.log(chalk.magenta('Will do an update on main channel...'))
          console.log(chalk.magenta(`Expo runtime version ${candidate}.`))
          const expoUpdateCommandBase = `eas update --auto --platform ${platform}`
          await aExec(expoUpdateCommandBase)
          process.exit(0)
        break;
      }
      case 'build': {
        const expoCommandBase = `eas build --non-interactive --no-wait --platform ${platform}`
        if (process.env.WORKFLOW_ENVIRONMENT === 'production') {
          console.log(chalk.magenta('Will do a build on production env...'))
          await aExec(`${expoCommandBase} --profile production --auto-submit`)
          process.exit(0)
        }
        if (process.env.WORKFLOW_ENVIRONMENT === 'staging') {
          console.log(chalk.blue('Will do a build on staging env...'))
          const promise = aExec(`${expoCommandBase} --profile staging`)
          const child  = promise.child
          child.stdout.on('data', function(data) {
              console.log(data);
          });
          child.stderr.on('data', function(data) {
              console.log(data);
          });
          child.on('close', function(code) {
              console.log('closing code: ' + code);
          });

          // i.e. can then await for promisified exec call to complete
          await promise;
          process.exit(0)
        }
        console.log(chalk.red(`Unknown WORKFLOW_ENVIRONMENT ${process.env.WORKFLOW_ENVIRONMENT}`))
        process.exit(2)
        break;
      }
      default: {
        console.log(chalk.red(`Unknown EAS_WORKFLOW_TYPE ${process.env.EAS_WORKFLOW_TYPE}`))
        process.exit(2)
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(chalk.red(error.message))
    } else {
      console.log(chalk.red('Unknown error'))
    }
    process.exit(3)
  }
}


program
    .description('This app simplify the build run instead of running it directly on bash')
    .action(actionHandler)
    .parse()
