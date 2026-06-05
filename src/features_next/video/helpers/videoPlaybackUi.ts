/** Erreur levée par le navigateur quand `play()` est bloqué (autoplay policy). */
export function isAutoplayPolicyError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === 'NotAllowedError'
  }
  if (error != null && typeof error === 'object' && 'name' in error) {
    return (error as { name: string }).name === 'NotAllowedError'
  }
  return false
}

/**
 * Affiche l'icône play quand la vidéo ne joue pas ET que l'utilisateur
 * l'a stoppée, que l'autoplay a échoué, ou qu'aucune lecture auto n'est attendue
 * (évite le flash pendant le chargement autoplay).
 */
export function shouldShowVideoPlayIcon(
  isPlaying: boolean,
  isUserPaused: boolean,
  autoplayFailed: boolean,
  shouldAutoPlay: boolean,
): boolean {
  if (isPlaying) return false
  return isUserPaused || autoplayFailed || !shouldAutoPlay
}
