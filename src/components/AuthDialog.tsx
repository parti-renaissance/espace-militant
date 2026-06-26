import React from 'react'
import { YStack, YStackProps } from 'tamagui'

import AuthComponent from './AuthComponent'
import VoxCard from './VoxCard/VoxCard'

const DialogAuth = ({ children, title, ...props }: YStackProps & { title: string }) => {
  return (
    <VoxCard bg="$colorTransparent" overflow="hidden" position="relative" {...props}>
      <YStack justifyContent="center">{children}</YStack>
      <YStack
        backgroundColor="$gray/16"
        style={{
          position: 'absolute',
          zIndex: 0,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <YStack position="absolute" top={0} left={0} width="100%" height="100%" justifyContent="center" alignItems="center">
        <YStack bg="$white1" p={24} borderRadius={16} gap={24} maxWidth={375} borderColor="$textOutline" borderWidth={4} {...props}>
          <AuthComponent>{title}</AuthComponent>
        </YStack>
      </YStack>
    </VoxCard>
  )
}

export default DialogAuth
