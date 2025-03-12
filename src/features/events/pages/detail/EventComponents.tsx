import React from 'react'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import { ScrollView, ScrollViewProps, useMedia } from 'tamagui'

const padding = '$medium'

export function ScrollStack({ children, ...props }: ScrollViewProps) {
  const media = useMedia()
  const { isWebPageLayoutScrollActive } = usePageLayoutScroll()

  return (
    <PageLayout.MainSingleColumn>
      <ScrollView
        {...props}
        flex={1}
        scrollEnabled={!isWebPageLayoutScrollActive}
        contentContainerStyle={{
          pt: media.gtSm ? padding : undefined,
          pl: media.gtSm ? padding : undefined,
          pr: media.gtSm ? padding : undefined,
          pb: '$xxxlarge',
        }}
      >
        {children}
      </ScrollView>
    </PageLayout.MainSingleColumn>
  )
}
