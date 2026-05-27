import { type ComponentProps, type ReactNode } from 'react'
import { styled, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'
import Title from '@/components/Title/Title'

import type { IconComponent } from '@/models/common.model'

const IconBadge = styled(XStack, {
  width: 32,
  height: 32,
  borderRadius: 999,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$color200',
})

type CallToActionCardTheme = 'gray' | 'blue' | 'teal' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple'

export type CallToActionCardProps = Omit<ComponentProps<typeof YStack>, 'children'> & {
  icon?: IconComponent
  title: ReactNode
  description: ReactNode
  children: ReactNode
  theme?: CallToActionCardTheme
}

export default function CallToActionCard({
  icon: Icon,
  title,
  description,
  children,
  theme = 'gray',
  ...props
}: Readonly<CallToActionCardProps>) {
  const ariaLabel = typeof title === 'string' ? title : undefined

  return (
    <YStack backgroundColor="$white0" borderRadius="$medium" padding="$medium" gap="$medium" {...props}>
      <YStack gap="$small">
        <XStack alignItems="center" gap="$small">
          {Icon ? (
            <IconBadge theme={theme}>
              <Icon size={16} color="$gray900" />
            </IconBadge>
          ) : null}

          <Title size="h2" aria-label={ariaLabel} flexShrink={1}>
            {typeof title === 'string' ? <Title.Text>{title}</Title.Text> : title}
          </Title>
        </XStack>

        <Text.SM color="$gray6" regular>
          {description}
        </Text.SM>
      </YStack>

      <YStack gap={12}>{children}</YStack>
    </YStack>
  )
}
