import type { RefObject } from 'react'

export type VideoPlayerProps = {
  hlsUrl: string
  thumbnailUrl: string
  width?: number
  height?: number
  loop?: boolean
  /**
   * Contrôle explicite play/pause (mode feed ou usage avancé).
   * Si omis, dérivé de `autoPlay` et `active`.
   */
  shouldPlay?: boolean
  /** @deprecated Préférer `shouldPlay`. Conservé pour les usages standalone. */
  autoPlay?: boolean
  /** @deprecated Préférer `shouldPlay`. Conservé pour les usages standalone. */
  active?: boolean
  /** Affiche les contrôles natifs. Si false, seul un overlay play/pause est affiché. */
  controls?: boolean
  muted?: boolean
  onMutedChange?: () => void
  showMuteButton?: boolean
  onUserPlay?: () => void
  onUserPause?: () => void
  /**
   * Ref synchronisée pour bloquer un `play()` différé après pause utilisateur (feed).
   */
  playAllowedRef?: RefObject<boolean>
  /**
   * Quand true, le player est actif dès le montage (pas de poster).
   * Défaut : `autoPlay` en mode standalone.
   */
  startActivated?: boolean
  /**
   * Remplit le parent sans wrapper aspect-ratio (slot feed).
   */
  embedded?: boolean
  /**
   * Quand true, la vidéo remplit son conteneur parent (flex) et se crop en `cover`.
   */
  fill?: boolean
  /** Coins arrondis du conteneur vidéo (défaut: true). */
  rounded?: boolean
  containerBackgroundColor?: string
}

export const getVideoAspectRatio = (width?: number, height?: number) => (height && height > 0 && width ? width / height : 16 / 9)
