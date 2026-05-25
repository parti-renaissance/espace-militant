import { useCallback, type RefObject } from 'react'
import * as Clipboard from 'expo-clipboard'
import { useToastController } from '@tamagui/toast'

import { getDomFromTamaguiRef, type TamaguiInputRef } from '../utils/getDomFromTamaguiRef'

type Params = {
  inputRef: RefObject<TamaguiInputRef | null>
  setInput: (value: string) => void
}

export function useBotMessageActions({ inputRef, setInput }: Params) {
  const toast = useToastController()

  const handleCopy = useCallback(
    (text: string) => {
      Clipboard.setStringAsync(text)
        .then(() => toast.show('Texte copié', { type: 'info' }))
        .catch(() => toast.show('Erreur lors de la copie', { type: 'error' }))
    },
    [toast],
  )

  const handleEdit = useCallback(
    (text: string) => {
      setInput(text)
      getDomFromTamaguiRef(inputRef)?.focus()
    },
    [inputRef, setInput],
  )

  return { handleCopy, handleEdit }
}
