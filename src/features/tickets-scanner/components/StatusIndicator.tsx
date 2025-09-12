import React from 'react'
import { QrCode, TicketCheck, TicketX } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'
import Text from '@/components/base/Text'
import { ScanTicketResponse } from '@/services/tickets/schema'
import SkeCard from '@/components/Skeleton/CardSkeleton'

interface StatusIndicatorProps {
  ticket: ScanTicketResponse
}

export default function StatusIndicator({ ticket }: StatusIndicatorProps) {
  const getStatusConfig = (statusCode: string) => {
    switch (statusCode) {
      case 'valid':
      case 'already_scanned':
        return {
          color: '$green4',
          icon: TicketCheck,
          title: 'VALIDE',
          subtitle: ticket.status.subtitle
        }
      case 'invalid':
        return {
          color: '$red4',
          icon: TicketX,
          title: 'INVALIDE',
          subtitle: ticket.status.subtitle
        }
      case 'unknown':
        return {
          color: '$gray4',
          icon: QrCode,
          title: 'INCONNU',
          subtitle: ticket.status.subtitle
        }
      default:
        return {
          color: '$gray4',
          icon: QrCode,
          title: 'INCONNU',
          subtitle: ticket.status.subtitle
        }
    }
  }

  const config = getStatusConfig(ticket.status.code)
  const IconComponent = config.icon

  return (
    <YStack gap="$small" alignItems="center" justifyContent="center">
      <YStack backgroundColor={config.color} w={64} h={64} borderRadius={32} justifyContent="center" alignItems="center">
        <IconComponent size={32} color="white" />
      </YStack>
      <YStack>
        <Text.LG fontSize={24} textAlign="center" color={config.color}>
          {config.title}
        </Text.LG>
        <Text.MD secondary textAlign="center">
          {config.subtitle}
        </Text.MD>
      </YStack>
    </YStack>
  )
}

export const StatusIndicatorSkeleton = () => {
  return (
    <YStack gap="$small" alignItems="center" justifyContent="center">
      <YStack backgroundColor="#F7F7F7" w={64} h={64} borderRadius={32}>
      </YStack>
      <YStack gap="$xsmall" alignItems="center">
        <YStack h={25} w={100} bg="#F7F7F7" />
        <YStack h={16} w={200} bg="#F7F7F7" />
      </YStack>
    </YStack>
  )
}