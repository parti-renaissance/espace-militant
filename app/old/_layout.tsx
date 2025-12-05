import React from 'react'
import { Stack } from 'expo-router'

export default function AppLayout() {
  return <Stack screenOptions={{ animation: 'slide_from_right', fullScreenGestureEnabled: true, headerShown: false }} />
}
