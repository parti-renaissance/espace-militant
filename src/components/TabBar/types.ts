import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { ThemeName } from 'tamagui'

export type TabBarNavProps = BottomTabBarProps & {
  descriptors: TabBarNavDescriptors
  hide?: boolean
}

export type TabBarNavDescriptors = BottomTabBarProps['descriptors'] & {
  [key: string]: { options: TabNavOptions }
}

export type TabNavOptions = BottomTabNavigationOptions & { tabBarTheme?: ThemeName; tabBarVisible?: boolean; disabled?: boolean }
