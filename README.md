#### Technologies

**Vox** application is built with [Expo](https://docs.expo.dev/) and [Typescript](https://www.typescriptlang.org/).

[![CodeFactor](https://www.codefactor.io/repository/github/parti-renaissance/app-mobile/badge)](https://www.codefactor.io/repository/github//parti-renaissance/app-mobile)

## Getting started

### Installing dependencies

To be able to run the application on iOS and Android:

- install [Yarn](https://yarnpkg.com/getting-started/install)
- run `yarn install` to install the project dependencies

### Building/Running the app locally

- copy the `.env` file to `.env.local` and fill in the environment variables
- run `yarn prepare:env` to generate clientEnv.ts (this shall be done on every .env.local changes).
- download the `GoogleService-Info.plist` and `google-services.json` files from the Firebase console and place them in the `config/` folder
- run `yarn run start` to start the react-native bundler
- run `yarn run ios` to start the iOS app
- run `yarn run android` to start the Android app
- run `yarn run web` to start the web app


## Deploy the app

- versioning structure : ex -> 1.0.0#1 -> appVersion#eas_update_version
  - appVersion = runtimeVersion
  - eas_update_version = eas_update_version

### EAS Update

- bump "eas_update_version" in app.json in extra
- use deploy workflow, select your branch, environement, and EAS deploy type to "update"

###  build the app for internal testing

- use deploy workflow, select your branch, staging environement, and EAS deploy type to "build"

### Deploying the app for production

- bump "version" in app.json
- use deploy workflow, select your branch, productiom environement, and EAS deploy type to "build"



## Contribution

- make a pull request to the `develop` branch
- make sure to run prettier while developing with `bun prettier-watch` or use `bun format` to format the code
- please avoid to :
  - use `any` type
  - use `console.log` for debugging
  - use `@ts-ignore` or `@ts-nocheck` to ignore typescript errors
  - use `classes` as much as possible

## Test deep link

To launch with link

`adb shell am start -W -a android.intent.action.VIEW -d "exp+vox:///evenements/2025-04-16-ljzbecb" fr.en_marche.jecoute.development`

Or using npx react native tools

`npx uri-scheme open exp+vox:///evenements/2025-04-16-ljzbecb --android`

`npx uri-scheme open exp+vox:///evenements/2025-04-16-ljzbecb --ios`
