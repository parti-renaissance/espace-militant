import React, { FunctionComponent } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { headerOptions } from '../../../styles/navigationAppearance'
import { Screen } from '../../../navigation'
import DoorToDoorBriefScreen from './DoorToDoorBriefScreen'
import DoorToDoorTunnelStartScreen from './DoorToDoorTunnelStartScreen'
import TunnelDoorOpeningScreen from './TunnelDoorOpeningScreen'

const Stack = createStackNavigator()

const DoorToDoorTunnelModal: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name={Screen.doorToDoorBrief}
        component={DoorToDoorBriefScreen}
        options={{ headerLeft: () => null, title: '' }}
      />
      <Stack.Screen
        name={Screen.doorToDoorTunnelStart}
        component={DoorToDoorTunnelStartScreen}
        options={{ headerLeft: () => null, title: '' }}
      />
      <Stack.Screen
        name={Screen.tunnelDoorOpening}
        component={TunnelDoorOpeningScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default DoorToDoorTunnelModal
