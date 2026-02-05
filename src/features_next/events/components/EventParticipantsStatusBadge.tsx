import React, { memo, useMemo } from 'react'
import { XStack } from 'tamagui'
import { Check, HelpCircle, Send } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'

type Status = 'confirmed' | 'invited' | string | null | undefined

type StatusBadgeProps = {
  status?: Status
}

const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const { label, Icon, theme } = useMemo(() => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmé',
          Icon: Check,
          theme: 'green' as const,
        }
      case 'invited':
        return {
          label: 'Invité',
          Icon: Send,
          theme: 'orange' as const,
        }
      default:
        return {
          label: 'Inconnu',
          Icon: HelpCircle,
          theme: 'gray' as const,
        }
    }
  }, [status])

  return (
    <XStack alignItems="center" gap="$3" theme={theme}>
      <Icon size={12} color="$color" />
      <Text.SM semibold color="$color">
        {label}
      </Text.SM>
    </XStack>
  )
})

StatusBadge.displayName = 'StatusBadge'

export default StatusBadge
