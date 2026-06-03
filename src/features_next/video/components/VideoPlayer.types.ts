export type VideoPlayerProps = {
  hlsUrl: string
  thumbnailUrl: string
  width?: number
  height?: number
  autoPlay?: boolean
  loop?: boolean
  /** Quand false, met la lecture en pause (ex. écran non focalisé). */
  active?: boolean
  /** Affiche les contrôles natifs. Si false, seul un overlay play/pause est affiché. */
  controls?: boolean
  /**
   * Quand true, la vidéo remplit son conteneur parent (flex) et se crop en `cover`.
   */
  fill?: boolean
  /** Coins arrondis du conteneur vidéo (défaut: true). */
  rounded?: boolean
}

export const getVideoAspectRatio = (width?: number, height?: number) => (height && height > 0 && width ? width / height : 16 / 9)
