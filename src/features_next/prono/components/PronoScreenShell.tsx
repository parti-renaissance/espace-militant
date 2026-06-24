import { ReactNode, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { ScrollView, useMedia, YStack } from 'tamagui'

import { useLayoutContext } from '@/components/AppStructure/Layout/LayoutContext'

import PronoNavHeader from './PronoNavHeader'

type PronoScreenShellProps = {
  children: ReactNode
}

export default function PronoScreenShell({ children }: PronoScreenShellProps) {
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
    <ScrollView flex={1} backgroundColor="$gray50" contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
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
  )
}
