import React, { ComponentProps, ReactNode } from 'react'
import Text from '@/components/base/Text'
import type { IconComponent } from '@/models/common.model'
import { View, XStack } from 'tamagui'
import VoxCard from '../VoxCard/VoxCard'

type Props = {
  children: string | string[] | ReactNode
  iconLeft: IconComponent
  rightComponent?: React.ReactNode
} & ComponentProps<typeof VoxCard>

export const MessageCard = ({ children, iconLeft: IconLeft, rightComponent, ...props }: Props) => (
  <VoxCard inside bg="$color1" {...props}>
    <VoxCard.Content>
      <XStack gap="$medium" alignItems="center">
        <View width={24} height={24}>
          <IconLeft size={24} color="$color7" />
        </View>
        <Text.MD multiline color="$color7" semibold flexShrink={1}>
          {children}
        </Text.MD>
        {rightComponent ?? null}
      </XStack>
    </VoxCard.Content>
  </VoxCard>
)
