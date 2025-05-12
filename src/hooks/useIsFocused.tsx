import { useNavigation } from 'expo-router'

export default function useIsFocused() {
  const nav = useNavigation()

  return nav.isFocused()
}
