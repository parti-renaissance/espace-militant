import { useToastController } from '@tamagui/toast'
import * as Clipboard from 'expo-clipboard'

export function useHandleCopyUrl() {
  const toast = useToastController()
  return (shareUrl: string) =>
    Clipboard.setStringAsync(shareUrl)
      .then(() => {
        toast.show('Lien copié', { type: 'info' })
      })
      .catch(() => {
        toast.show('Erreur lors de la copie du lien', { type: 'error' })
      })
}
