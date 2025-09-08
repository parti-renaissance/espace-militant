import React from 'react'
import { QrCode, TicketCheck, TicketX } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'
import Text from '@/components/base/Text'
import { ScanTicketResponse } from '@/services/tickets/schema'

interface StatusIndicatorProps {
  ticket: ScanTicketResponse
}

export default function StatusIndicator({ ticket }: StatusIndicatorProps) {
  const getStatusConfig = (status: ScanTicketResponse['status']) => {
    switch (status) {
      case 'valid':
      case 'already_scanned':
        return {
          color: '$green4',
          icon: TicketCheck,
          title: 'VALIDE',
          subtitle: 'Personne autorisée à entrer'
        }
      case 'invalid':
        return {
          color: '$orange6',
          icon: TicketX,
          title: 'INVALIDE',
          subtitle: 'Personne non-autorisée à entrer'
        }
      case 'unknown':
        return {
          color: '$gray4',
          icon: QrCode,
          title: 'INCONNU',
          subtitle: 'Envoyer au point information'
        }
      default:
        return {
          color: '$gray4',
          icon: QrCode,
          title: 'INCONNU',
          subtitle: 'Envoyer au point information'
        }
    }
  }

  const config = getStatusConfig(ticket.status)
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

