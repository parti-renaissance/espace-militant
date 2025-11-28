import React, { useEffect } from 'react'
import { Stack } from 'expo-router'

export default function ProfilLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
        fullScreenGestureEnabled: true,
        contentStyle: {
          backgroundColor: '#fafafb',
        },
      }}
      initialRouteName="index"
    />
  )
}

