import { type NativeStackNavigationOptions } from 'expo-router'
import * as Colors from './colors'

export const headerBlank: NativeStackNavigationOptions = {
  title: '',
  headerTintColor: Colors.titleText,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: Colors.navigationBackground,
  },
}
