import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { FunctionComponent } from 'react'
import HomeScreen from '../../screens/home/HomeScreen'
import { headerBlank } from '../../styles/navigationAppearance'
import RegionScreen from '../../screens/regions/RegionScreen'
import NewsScreen from '../../screens/news/NewsScreen'
import EventDetailsScreen from '../../screens/eventDetail/EventDetailsScreen'
import RetaliationDetailScreen from '../../screens/retaliation/RetaliationDetailScreen'
import DoorToDoorScreen from '../../screens/doorToDoor/DoorToDoorScreen'
import BuildingDetailScreen from '../../screens/buildingDetail/BuildingDetailScreen'
import { HomeNavigatorParamList } from './HomeNavigatorParamList'

const Stack = createStackNavigator<HomeNavigatorParamList>()

const HomeNavigator: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={headerBlank}>
      <Stack.Screen
        name={'Home'}
        component={HomeScreen}
        options={{ headerTransparent: true }}
      />
      <Stack.Screen
        name={'Region'}
        component={RegionScreen}
        options={{ headerTransparent: true }}
      />
      <Stack.Screen name={'News'} component={NewsScreen} />
      <Stack.Screen name={'EventDetails'} component={EventDetailsScreen} />
      <Stack.Screen
        name={'RetaliationDetail'}
        component={RetaliationDetailScreen}
      />
      {/* DoorToDoor */}
      <Stack.Screen
        name={'DoorToDoor'}
        component={DoorToDoorScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={'BuildingDetail'}
        component={BuildingDetailScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  )
}

export default HomeNavigator
