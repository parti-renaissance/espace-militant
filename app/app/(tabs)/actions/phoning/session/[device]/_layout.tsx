import React, { FunctionComponent } from 'react'
import { headerBlank } from '@/styles/navigationAppearance'

import { Stack } from 'expo-router'
const PhoningSessionModal: FunctionComponent = () => {
    return (
        <Stack screenOptions={{ ...headerBlank}}>
            <Stack.Screen
                name='poll/detail'
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name={'loader-permanent-campaign'}
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name={'poll/success'}
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name='index'
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name='number-found'
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name='number-found-other-device'
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name='call/status-picker'
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name="call/failure"
                options={{ headerLeft: () => null }}
            />
            <Stack.Screen
                name={'no-number-available'}
                options={{ headerLeft: () => null }}
            />
        </Stack>
    )
}

export default PhoningSessionModal
