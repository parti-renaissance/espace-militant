import { useCallback } from 'react'
import { BackHandler } from 'react-native'
import { useFocusEffect } from "expo-router/react-navigation"

export const useBackHandler = (handler: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handler()
          return true
        },
      )

      return () => backHandler.remove()
    }, [handler]),
  )
}
