import { useEffect } from 'react'
import { useNavigation } from "expo-router/react-navigation"

export const useOnFocus = (focusEffect: () => void) => {
  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      focusEffect()
    })
    return unsubscribe
  }, [navigation, focusEffect])
}
