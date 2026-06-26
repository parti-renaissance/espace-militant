import { ReactNode, useCallback } from 'react'
import { KeyboardAvoidingView, Platform, RefreshControl } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { ScrollView, useMedia, YStack } from 'tamagui'

import { useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'

import PronoNavHeader from './PronoNavHeader'

const KEYBOARD_VERTICAL_OFFSET = 100

type PronoScreenShellProps = {
  children: ReactNode
  onRefresh?: () => void
  refreshing?: boolean
}

export default function PronoScreenShell({ children, onRefresh, refreshing }: PronoScreenShellProps) {
  const media = useMedia()
  const isDesktop = media.gtSm
  const { setHideTabBar } = useLayoutContext()

  useFocusEffect(
    useCallback(() => {
      setHideTabBar(true)
      return () => setHideTabBar(false)
    }, [setHideTabBar]),
  )

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'height' : 'padding'} keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}>
      <ScrollView
        flex={1}
        backgroundColor="$gray50"
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}
      >
        {!isDesktop ? <PronoNavHeader /> : null}
        <YStack
          width="100%"
          maxWidth={isDesktop ? 480 : undefined}
          paddingHorizontal={isDesktop ? '$large' : '$medium'}
          paddingTop={isDesktop ? '$xlarge' : '$xsmall'}
          paddingBottom={isDesktop ? '$xlarge' : '$medium'}
          gap="$medium"
        >
          {children}
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
