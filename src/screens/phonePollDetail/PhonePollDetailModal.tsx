import React, { FunctionComponent } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { headerOptions } from '../../styles/navigationAppearance'
import { PhonePollDetailScreenProps, Screen } from '../../navigation'
import PhonePollDetailScreen from './PhonePollDetailScreen'
import PhonePollDetailSuccessScreen from '../phonePollDetailSuccess/PhonePollDetailSuccessScreen'
import PhoningSessionLoaderScreen from '../phoningSessionLoader/PhoningSessionLoaderScreen'
import PhoningSessionNumberFoundScreen from '../phoningSessionNumberFound/PhoningSessionNumberFoundScreen'

const Stack = createStackNavigator()

const PhonePollDetailModal: FunctionComponent<PhonePollDetailScreenProps> = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name={Screen.phonePollDetail}
        component={PhonePollDetailScreen}
        options={{ headerLeft: () => null, title: '' }}
      />
      <Stack.Screen
        name={Screen.phonePollDetailSuccess}
        component={PhonePollDetailSuccessScreen}
        options={{ headerLeft: () => null, title: '' }}
      />
      <Stack.Screen
        name={Screen.phoningSessionLoader}
        component={PhoningSessionLoaderScreen}
        options={{ headerLeft: () => null, title: '' }}
      />
      <Stack.Screen
        name={Screen.phoningSessionNumberFound}
        component={PhoningSessionNumberFoundScreen}
        options={{ headerLeft: () => null, title: '' }}
      />
    </Stack.Navigator>
  )
}

export default PhonePollDetailModal
