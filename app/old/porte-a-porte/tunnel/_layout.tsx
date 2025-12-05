import React, { FunctionComponent } from 'react'
import { headerBlank } from '@/styles/navigationAppearance'
import i18n from '@/utils/i18n'
import { Stack } from 'expo-router'

const DoorToDoorTunnelModalNavigator: FunctionComponent = () => {
  return (
    <Stack screenOptions={headerBlank}>
      <Stack.Screen name="brief" />
      <Stack.Screen name={'selection'} />
      <Stack.Screen name={'interlocutor'} />
      <Stack.Screen name={'opening'} />
      <Stack.Screen name={'poll'} />
      <Stack.Screen
        name={'success'}
        options={{
          title: i18n.t('doorToDoor.tunnel.success.wellDone'),
        }}
      />
    </Stack>
  )
}

export default DoorToDoorTunnelModalNavigator
