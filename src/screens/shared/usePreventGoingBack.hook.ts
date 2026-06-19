import { useEffect, useLayoutEffect } from 'react'
import { useNavigation } from "expo-router/react-navigation"

export const usePreventGoingBack = (forceBack = false): void => {
  const { addListener, setOptions } = useNavigation()

  useEffect(() => {
    const unsubscribe = addListener('beforeRemove', (e) => {
      // We don't want this hook to prevent reseting the navigation stack
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault()
      }
    })
    return unsubscribe
  }, [forceBack, addListener])

  useLayoutEffect(() => {
    // Avoid gesture in iOS
    setOptions({ gestureEnabled: false })
  })
}
