import { styled, XStack } from 'tamagui'

export type IconBadgeTheme = 'gray' | 'blue' | 'teal' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple'

const IconBadge = styled(XStack, {
  width: 32,
  height: 32,
  borderRadius: 999,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$color200',
})

export default IconBadge
