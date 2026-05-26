import { ComponentProps } from 'react'
import { styled, View } from 'tamagui'

import Text from '../base/Text'

export const BadgeFrame = styled(View, {
  backgroundColor: '$color1',
  borderRadius: '$12',
  paddingVertical: '$xsmall',
  paddingHorizontal: '$small',
  variants: {
    outlined: {
      true: {
        backgroundColor: 'transparent',
        borderWidth: '$borderWidth',
        borderColor: '$color1',
      },
    },
  },
} as const)

export type BadgeProps = {
  children: string | string[]
} & ComponentProps<typeof BadgeFrame>

const Badge = ({ children, ...props }: BadgeProps) => {
  return (
    <BadgeFrame {...props}>
      <Text.SM semibold color="$color7">
        {children}
      </Text.SM>
    </BadgeFrame>
  )
}

export default Badge
