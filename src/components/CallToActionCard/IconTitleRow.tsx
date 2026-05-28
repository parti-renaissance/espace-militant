import type { ComponentProps, ReactNode } from 'react'
import { XStack } from 'tamagui'

import type { IconComponent } from '@/models/common.model'

import Title from '../Title/Title'

import IconBadge, { type IconBadgeTheme } from './IconBadge'

export type IconTitleRowTheme = IconBadgeTheme

type IconTitleRowProps = Omit<ComponentProps<typeof XStack>, 'children'> & {
  icon?: IconComponent
  title: ReactNode
  theme?: IconTitleRowTheme
}

export default function IconTitleRow({ icon: Icon, title, theme = 'gray', ...props }: Readonly<IconTitleRowProps>) {
  return (
    <XStack alignItems="center" gap="$small" {...props}>
      {Icon ? (
        <IconBadge theme={theme}>
          <Icon size={16} color="$gray900" />
        </IconBadge>
      ) : null}
      {typeof title === 'string' ? (
        <Title size="h2">
          <Title.Text>{title}</Title.Text>
        </Title>
      ) : (
        title
      )}
    </XStack>
  )
}
