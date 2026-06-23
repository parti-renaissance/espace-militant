import { useColorScheme } from 'react-native'
import Error404 from '@/components/404/Error404'
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation"
import { TamaguiProvider } from '@tamagui/core'

export default function UnmatchedRoute() {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Error404 />
      </ThemeProvider>
    </TamaguiProvider>
  )
}
