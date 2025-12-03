import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMedia } from 'tamagui'

const SAFE_AREA_PADDING = 24
const TABBAR_HEIGHT_SM = 64

type SpacingConfig = {
    /** Active l'espacement de base et le safe spacing en haut */
    top?: boolean
    /** Active l'espacement de base et le safe spacing en bas */
    bottom?: boolean
    /** Active l'espacement de base et le safe spacing à gauche */
    left?: boolean
    /** Active l'espacement de base et le safe spacing à droite */
    right?: boolean
    /** Active les safe spacings sur tous les côtés (par défaut: true) */
    safeArea?: boolean
    /** Active uniquement le safe spacing en haut (surcharge safeArea) */
    safeAreaTop?: boolean
    /** Active uniquement le safe spacing en bas (surcharge safeArea) */
    safeAreaBottom?: boolean
    /** Active uniquement le safe spacing à gauche (surcharge safeArea) */
    safeAreaLeft?: boolean
    /** Active uniquement le safe spacing à droite (surcharge safeArea) */
    safeAreaRight?: boolean
  }
  
  type SpacingPreset = 'left' | 'right' | true | false
  
  export type UseLayoutSpacingOptions = SpacingConfig | SpacingPreset
  
  export default function useLayoutSpacing(options: UseLayoutSpacingOptions = true) {
    const media = useMedia()
    const insets = useSafeAreaInsets()
  
    let py = 16
    if (media.xl) py = 12
    if (media.lg) py = 8
    if (media.sm) py = 8
  
    let px = 32
    if (media.xl) px = 24
    if (media.lg) px = 16
    if (media.sm) px = 0
  
    // Calculer les espacements de base avec safe areas
    const baseSpacing = (() => {
      if (options === false) {
        return {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }
      }
  
      const safeAreaOptions =
        typeof options === 'object'
          ? {
              safeArea: options.safeArea ?? true,
              safeAreaTop: options.safeAreaTop,
              safeAreaBottom: options.safeAreaBottom,
              safeAreaLeft: options.safeAreaLeft,
              safeAreaRight: options.safeAreaRight,
            }
          : { safeArea: true }
  
      const enableTop = safeAreaOptions.safeAreaTop ?? safeAreaOptions.safeArea ?? false
      const enableBottom = safeAreaOptions.safeAreaBottom ?? safeAreaOptions.safeArea ?? false
      const enableLeft = safeAreaOptions.safeAreaLeft ?? safeAreaOptions.safeArea ?? false
      const enableRight = safeAreaOptions.safeAreaRight ?? safeAreaOptions.safeArea ?? false
  
      return {
        paddingTop: py + SAFE_AREA_PADDING + (enableTop ? insets.top : 0),
        paddingBottom: py + SAFE_AREA_PADDING + (enableBottom ? insets.bottom : 0) + (media.sm ? TABBAR_HEIGHT_SM : 0),
        paddingLeft: px + (enableLeft ? insets.left : 0),
        paddingRight: px + (enableRight ? insets.right : 0),
      }
    })()
  
    // Appliquer les presets et la configuration par côté
    if (options === false) {
      return baseSpacing
    }
  
    if (options === true) {
      return baseSpacing
    }
  
    if (options === 'left') {
      return {
        paddingTop: baseSpacing.paddingTop,
        paddingBottom: baseSpacing.paddingBottom,
        paddingLeft: baseSpacing.paddingLeft,
        paddingRight: 0,
      }
    }
  
    if (options === 'right') {
      return {
        paddingTop: baseSpacing.paddingTop,
        paddingBottom: baseSpacing.paddingBottom,
        paddingLeft: 0,
        paddingRight: baseSpacing.paddingRight,
      }
    }
  
    // Configuration personnalisée
    const config = options as SpacingConfig
    return {
      paddingTop: config.top === false ? 0 : baseSpacing.paddingTop,
      paddingBottom: config.bottom === false ? 0 : baseSpacing.paddingBottom,
      paddingLeft: config.left === false ? 0 : baseSpacing.paddingLeft,
      paddingRight: config.right === false ? 0 : baseSpacing.paddingRight,
    }
  }

