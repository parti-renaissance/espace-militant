const { createRunOncePlugin, withPodfile } = require('@expo/config-plugins')

const MAPBOX_STATIC_PODS = ['MapboxCommon', 'MapboxCoreMaps', 'MapboxMaps', 'Turf']

const PRE_INSTALL_OVERRIDE = `
    # @generated begin mapbox-firebase-static-linking - expo prebuild (DO NOT MODIFY)
    # RNMapbox pre_install forces Mapbox SDKs to dynamic frameworks, which conflicts with
    # useFrameworks: static (required by Firebase). Revert to static libraries after RNMapbox hook.
    installer.aggregate_targets.each do |target|
      target.pod_targets.select { |p| ${JSON.stringify(MAPBOX_STATIC_PODS)}.include?(p.name) }.each do |pod|
        pod.instance_variable_set(:@build_type, Pod::BuildType.static_library)
      end
    end
    # @generated end mapbox-firebase-static-linking`

/**
 * Fixes iOS pod install when combining @react-native-firebase (useFrameworks: static)
 * with @rnmapbox/maps on Expo SDK 56+.
 */
function withIosMapboxFirebaseFix(config) {
  return withPodfile(config, (exportedConfig) => {
    let contents = exportedConfig.modResults.contents

    if (!contents.includes('$RNMapboxMapsUseFrameworks')) {
      if (contents.includes("$RNMapboxMapsImpl = 'mapbox'")) {
        contents = contents.replace(
          "$RNMapboxMapsImpl = 'mapbox'",
          "$RNMapboxMapsImpl = 'mapbox'\n$RNMapboxMapsUseFrameworks = true",
        )
      } else {
        contents = contents.replace(
          /target .+ do\n/,
          (match) => `${match}$RNMapboxMapsUseFrameworks = true\n`,
        )
      }
    }

    if (!contents.includes('mapbox-firebase-static-linking')) {
      contents = contents.replace(
        '$RNMapboxMaps.pre_install(installer)',
        `$RNMapboxMaps.pre_install(installer)${PRE_INSTALL_OVERRIDE}`,
      )
    }

    exportedConfig.modResults.contents = contents
    return exportedConfig
  })
}

module.exports = createRunOncePlugin(withIosMapboxFirebaseFix, 'with-ios-mapbox-firebase-fix', '1.0.0')
