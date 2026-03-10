import { ComponentProps, ReactNode } from 'react'
import { styled, XStack } from 'tamagui'

import type { IconComponent } from '@/models/common.model'

import Text from '../base/Text'

const ChipFrame = styled(XStack, {
  backgroundColor: '$color1',
  borderRadius: 999,
  paddingVertical: 4,
  paddingHorizontal: 8,
  alignItems: 'center',
  variants: {
    outlined: {
      true: {
        backgroundColor: 'transparent',
        borderWidth: 1.2,
        borderColor: '$color5',
      },
    },
    alert: {
      true: {
        backgroundColor: '#FF3333',
      },
    },
  },
  gap: 4,
} as const)

export type ChipProps = {
  /** Contenu du chip : passer un nœud Text pour garder ton style (ex. <Text.SM numberOfLines={1}>...</Text.SM>), ou une string (style par défaut). */
  children: ReactNode
} & ComponentProps<typeof ChipFrame>

const Chip = ({ children, icon, ...props }: ChipProps & { icon?: IconComponent }) => {
  const Icon = icon
  const content =
    typeof children === 'string' ? (
      <Text.SM semibold color={props.alert ? 'white' : '$color5'}>
        {children}
      </Text.SM>
    ) : (
      children
    )

  return (
    <ChipFrame {...props} theme={props.theme ?? 'gray'}>
      {Icon && <Icon color={props.alert ? 'white' : '$color5'} testID="chip-icon" size={12} />}
      {content}
    </ChipFrame>
  )
}

export default Chip
