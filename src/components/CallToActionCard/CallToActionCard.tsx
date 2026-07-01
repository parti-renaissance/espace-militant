import { type ComponentProps, type ReactNode } from 'react'
import { YStack } from 'tamagui'

import Text from '@/components/base/Text'
import IconTitleRow, { type IconTitleRowTheme } from '@/components/CallToActionCard/IconTitleRow'

import type { IconComponent } from '@/models/common.model'

type CallToActionCardTheme = IconTitleRowTheme

export type CallToActionCardProps = Omit<ComponentProps<typeof YStack>, 'children'> & {
  icon?: IconComponent
  title: ReactNode
  description: ReactNode
  children: ReactNode
  theme?: CallToActionCardTheme
}

export default function CallToActionCard({ icon: Icon, title, description, children, theme = 'gray', ...props }: Readonly<CallToActionCardProps>) {
  const ariaLabel = typeof title === 'string' ? title : undefined

  return (
    <YStack backgroundColor="$white0" borderRadius="$medium" padding="$medium" gap="$medium" {...props}>
      <YStack gap="$small">
        <IconTitleRow icon={Icon} theme={theme} title={title} aria-label={ariaLabel} />

        <Text.SM color="$gray6" regular>
          {description}
        </Text.SM>
      </YStack>

      <YStack gap={12}>{children}</YStack>
    </YStack>
  )
}
