const { createRunOncePlugin, withPodfile } = require('@expo/config-plugins')

const TAG = 'ios-modular-headers'

const withIosModularHeaders = (config) =>
  withPodfile(config, (config) => {
    if (config.modResults.contents.includes(`@generated begin ${TAG}`)) {
      return config
    }

    config.modResults.contents = config.modResults.contents.replace(
      /prepare_react_native_project!\n/,
      `prepare_react_native_project!\n\n# @generated begin ${TAG} - expo prebuild (DO NOT MODIFY)\nuse_modular_headers!\n# @generated end ${TAG}\n`,
    )

    return config
  })

module.exports = createRunOncePlugin(withIosModularHeaders, 'with-ios-modular-headers', '1.0.0')
