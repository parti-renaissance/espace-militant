import React, { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'
import { Image } from 'expo-image'

import sparklePlainImg from './SparklePlain.png'

const Icon = (props: { size: number }) => {
  const { size = 24 } = props
  return (
    <Image
      source={sparklePlainImg}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

Icon.displayName = 'SparklePlain'

export const SparklePlain = memo<IconProps>(themed(Icon))
