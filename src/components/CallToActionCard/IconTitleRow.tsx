import type { ComponentProps, ReactNode } from 'react'
import { XStack, YStack } from 'tamagui'

import type { IconComponent } from '@/models/common.model'

import Title from '../Title/Title'

import IconBadge, { type IconBadgeTheme } from './IconBadge'

export type IconTitleRowTheme = IconBadgeTheme

const titleContainerProps = {
  flex: 1,
  flexShrink: 1,
  minWidth: 0,
} as const

type IconTitleRowProps = Omit<ComponentProps<typeof XStack>, 'children'> & {
  icon?: IconComponent
  title: ReactNode
  theme?: IconTitleRowTheme
  'aria-label'?: string
}

export default function IconTitleRow({
  icon: Icon,
  title,
  theme = 'gray',
  'aria-label': ariaLabel,
  ...props
}: Readonly<IconTitleRowProps>) {
  return (
    <XStack alignItems="center" gap="$small" {...props}>
      {Icon ? (
        <IconBadge theme={theme}>
          <Icon size={16} color="$gray900" />
        </IconBadge>
      ) : null}
      {typeof title === 'string' ? (
        <Title size="h2" aria-label={ariaLabel ?? title} {...titleContainerProps}>
          <Title.Text numberOfLines={2} flexShrink={1}>
            {title}
          </Title.Text>
        </Title>
      ) : (
        <YStack {...titleContainerProps}>{title}</YStack>
      )}
    </XStack>
  )
}
