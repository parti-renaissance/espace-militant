const fs = require('fs')
const path = require('path')

const baseIdentifier = 'fr.en-marche.jecoute'
const basePackage = 'fr.en_marche.jecoute'

function populateIosConfig(APPLE_TEAM_ID, BUNDLE_ID) {
  return {
    applinks: {
      apps: [],
      details: [
        {
          appIDs: [`${APPLE_TEAM_ID}.${BUNDLE_ID}`],
          components: [
            {
              '/': '*',
              comment: 'Matches all routes',
            },
          ],
        },
      ],
    },
    activitycontinuation: {
      apps: [`${APPLE_TEAM_ID}.${BUNDLE_ID}`],
    },
    webcredentials: {
      apps: [`${APPLE_TEAM_ID}.${BUNDLE_ID}`],
    },
  }
}

function populateAndroidConfig(PACKAGE_NAME) {
  return [
    {
      relation: [
        'delegate_permission/common.handle_all_urls',
        'delegate_permission/common.get_login_creds',
      ],
      target: {
        namespace: 'android_app',
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints: [
          'E9:79:8E:BB:EB:D0:5F:F0:B6:9A:A6:57:03:19:A5:EF:75:38:2F:DE:97:4A:D4:D4:8D:6A:33:1A:18:8A:ED:50', // Certificate got from `eas credentials`
          'FF:8E:5C:7B:3F:31:68:1B:B2:A4:E5:37:30:C4:18:E0:5B:D3:EE:20:DA:0C:2E:8F:E6:E4:4B:91:EF:29:53:C4', // Certificate signature extracted from APK
          '7A:6A:7E:3A:D2:80:F9:51:1C:A6:0C:04:CC:F9:6F:E5:45:51:E1:82:78:9D:9C:E3:4D:D5:6F:EC:65:3C:F9:9C', // Google Play Integrity key
        ],
      },
    },
  ]
}

const profile = process.env['EAS_BUILD_PROFILE'] ?? 'staging'
const APPLE_TEAM_ID = process.env['APPLE_TEAM_ID']

const bundleSuffix = profile === 'production' ? '' : `.${profile}`

const BUNDLE_ID = `${baseIdentifier}${bundleSuffix}`
const PACKAGE_NAME = `${basePackage}${bundleSuffix}`

let iosConfig = populateIosConfig(APPLE_TEAM_ID, BUNDLE_ID)
let androidConfig = populateAndroidConfig(PACKAGE_NAME)

fs.mkdirSync(path.join(__dirname, '../web/.well-known'), { recursive: true }, (err) => {
  if (err) throw err
})

const aasaPath = path.join(__dirname, '../web/.well-known', 'apple-app-site-association')
const assetlinksPath = path.join(__dirname, '../web/.well-known', 'assetlinks.json')

fs.writeFileSync(aasaPath, JSON.stringify(iosConfig), 'utf-8')
fs.writeFileSync(assetlinksPath, JSON.stringify(androidConfig), 'utf-8')
