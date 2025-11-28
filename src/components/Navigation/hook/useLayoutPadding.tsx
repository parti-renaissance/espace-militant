import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useMedia } from "tamagui"

const SAFE_AREA_PADDING = 16

type PaddingConfig = {
    /** Active le padding de base et le safe padding en haut */
    top?: boolean
    /** Active le padding de base et le safe padding en bas */
    bottom?: boolean
    /** Active le padding de base et le safe padding à gauche */
    left?: boolean
    /** Active le padding de base et le safe padding à droite */
    right?: boolean
    /** Active les safe paddings sur tous les côtés (par défaut: true) */
    safeArea?: boolean
    /** Active uniquement le safe padding en haut (surcharge safeArea) */
    safeAreaTop?: boolean
    /** Active uniquement le safe padding en bas (surcharge safeArea) */
    safeAreaBottom?: boolean
    /** Active uniquement le safe padding à gauche (surcharge safeArea) */
    safeAreaLeft?: boolean
    /** Active uniquement le safe padding à droite (surcharge safeArea) */
    safeAreaRight?: boolean
  }
  
  type PaddingPreset = 'left' | 'right' | true | false
  
  export type UseLayoutPaddingOptions = PaddingConfig | PaddingPreset
  
  export default function useLayoutPadding(options: UseLayoutPaddingOptions = true) {
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
  
    // Calculer les paddings de base avec safe areas
    const basePadding = (() => {
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
        paddingBottom: py + SAFE_AREA_PADDING + (enableBottom ? insets.bottom : 0),
        paddingLeft: px + (enableLeft ? insets.left : 0),
        paddingRight: px + (enableRight ? insets.right : 0),
      }
    })()
  
    // Appliquer les presets et la configuration par côté
    if (options === false) {
      return basePadding
    }
  
    if (options === true) {
      return basePadding
    }
  
    if (options === 'left') {
      return {
        paddingTop: basePadding.paddingTop,
        paddingBottom: basePadding.paddingBottom,
        paddingLeft: basePadding.paddingLeft,
        paddingRight: 0,
      }
    }
  
    if (options === 'right') {
      return {
        paddingTop: basePadding.paddingTop,
        paddingBottom: basePadding.paddingBottom,
        paddingLeft: 0,
        paddingRight: basePadding.paddingRight,
      }
    }
  
    // Configuration personnalisée
    const config = options as PaddingConfig
    return {
      paddingTop: config.top === false ? 0 : basePadding.paddingTop,
      paddingBottom: config.bottom === false ? 0 : basePadding.paddingBottom,
      paddingLeft: config.left === false ? 0 : basePadding.paddingLeft,
      paddingRight: config.right === false ? 0 : basePadding.paddingRight,
    }
  }