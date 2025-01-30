/* eslint-env node */
const { getSentryExpoConfig } = require('@sentry/react-native/metro')
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path')
const { generate } = require('@storybook/react-native/scripts/generate')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: false,
})
config.resolver.sourceExts.push('cjs')

const webAliases = {
  'react-native': 'react-native-web',
  'react-native-webview': '@10play/react-native-web-webview',
  'react-native/Libraries/Utilities/codegenNativeComponent': '@10play/react-native-web-webview/shim',
  crypto: 'expo-crypto',
}

config.resolver.resolveRequest = (context, realModuleName, platform, moduleName) => {
  if (platform === 'web') {
    const alias = webAliases[realModuleName]
    if (alias) {
      return {
        filePath: require.resolve(alias),
        type: 'sourceFile',
      }
    }
  }
  return context.resolveRequest(context, realModuleName, platform, moduleName)
}
// 1. Enable Storybook
generate({
  configPath: path.resolve(__dirname, './.storybook'),
  useJs: true,
})

// 2. Enable Tamagui
const { withTamagui } = require('@tamagui/metro-plugin')
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css',
})
