import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent, Platform } from 'react-native'

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const showSubscription = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height)
    })

    const hideSubscription = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      setKeyboardHeight(0)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return keyboardHeight
}
