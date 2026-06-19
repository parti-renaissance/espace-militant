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

const POST_INSTALL_OVERRIDE = `
    # @generated begin mapbox-firebase-swift-header - expo prebuild (DO NOT MODIFY)
    # useFrameworks: static enables RNMBX_USE_FRAMEWORKS in the podspec, but rnmapbox-maps links as a
    # static library — strip the flag so Objective-C++ imports <rnmapbox_maps-Swift.h> instead.
    installer.pods_project.targets.each do |target|
      next unless target.name == 'rnmapbox-maps'
      target.build_configurations.each do |config|
        %w[OTHER_CFLAGS OTHER_CPLUSPLUSFLAGS GCC_PREPROCESSOR_DEFINITIONS].each do |key|
          value = config.build_settings[key]
          next if value.nil?
          if value.is_a?(Array)
            config.build_settings[key] = value.reject { |f| f.to_s.include?('RNMBX_USE_FRAMEWORKS') }
          elsif value.is_a?(String)
            config.build_settings[key] = value.gsub(/-DRNMBX_USE_FRAMEWORKS=1\\s*/, '').strip
          end
        end
      end
    end
    # @generated end mapbox-firebase-swift-header`

/**
 * Fixes iOS build when combining @react-native-firebase (useFrameworks: static)
 * with @rnmapbox/maps on Expo SDK 56+.
 */
function withIosMapboxFirebaseFix(config) {
  return withPodfile(config, (exportedConfig) => {
    let contents = exportedConfig.modResults.contents

    // Do NOT set $RNMapboxMapsUseFrameworks — rnmapbox-maps is statically linked here.

    if (!contents.includes('mapbox-firebase-static-linking')) {
      contents = contents.replace(
        '$RNMapboxMaps.pre_install(installer)',
        `$RNMapboxMaps.pre_install(installer)${PRE_INSTALL_OVERRIDE}`,
      )
    }

    if (!contents.includes('mapbox-firebase-swift-header')) {
      contents = contents.replace(
        '$RNMapboxMaps.post_install(installer)',
        `$RNMapboxMaps.post_install(installer)${POST_INSTALL_OVERRIDE}`,
      )
    }

    exportedConfig.modResults.contents = contents
    return exportedConfig
  })
}

module.exports = createRunOncePlugin(withIosMapboxFirebaseFix, 'with-ios-mapbox-firebase-fix', '1.0.1')
