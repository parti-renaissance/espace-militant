import { useState } from 'react'
import { Image } from 'expo-image'
import { Image as TamaguiImage, useMedia, XStack, YStack } from 'tamagui'
import { AlertTriangle, Check, ExternalLink, QrCode, Ticket, UserRound } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { createOnShow } from '@/components/Cards/AlertCard/utils'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import VoxCard from '@/components/VoxCard/VoxCard'

import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { type HitSource } from '@/services/hits/constants'

const MEETING_IMAGE_MAX_SIZE = 500

type AlertItem = RestAlertsResponse[number]

// Payload attendu dans `alert.data` pour une alerte meeting (non typé côté schéma).
type MeetingAlertData = {
  first_name?: string
  last_name?: string
  ticket_url?: string
  ticket_custom_detail?: string
  info_url?: string
}

const getMeetingData = (alert: AlertItem) => (alert.data ?? {}) as MeetingAlertData

function MeetingTicketModal({ alert, isOpen, onClose, hitSource }: { alert: AlertItem; isOpen: boolean; onClose: () => void; hitSource: HitSource }) {
  const media = useMedia()
  const data = getMeetingData(alert)
  const onShowInfo = createOnShow(data.info_url ?? null, 'Voir les infos pratiques', hitSource)

  return (
    <ModalOrBottomSheet open={isOpen} onClose={onClose}>
      <YStack marginBottom={media.sm ? '$9' : undefined} padding="$11" gap="$8" alignSelf="center" alignItems="center" maxWidth={480}>
        <Text semibold fontSize="$6" color="$textPrimary">
          {data.first_name} {data.last_name}
        </Text>
        {data.ticket_custom_detail ? (
          <Text semibold fontSize={40} color="$blue9" textAlign="center">
            {data.ticket_custom_detail}
          </Text>
        ) : null}
        <TamaguiImage src={data.ticket_url} width={240} height={240} resizeMode="contain" />
        {data.info_url ? (
          <VoxButton alignSelf="center" variant="outlined" iconRight={ExternalLink} onPress={onShowInfo}>
            Voir les infos pratiques
          </VoxButton>
        ) : null}
      </YStack>
    </ModalOrBottomSheet>
  )
}

type AlertMeetingSheetProps = {
  alert: AlertItem
  hitSource: HitSource
}

export function AlertMeetingSheet({ alert, hitSource }: AlertMeetingSheetProps) {
  const media = useMedia()
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const { handleShareOrCopy } = useShareOrCopy()

  const alreadySubscribed = Boolean(alert.data)
  const hasTicket = Boolean(getMeetingData(alert).ticket_url)
  const onReserve = createOnShow(alert.cta_url, alert.cta_label, hitSource)

  const onPressShare = () => {
    if (!alert.share_url) return
    handleShareOrCopy({ url: alert.share_url, message: alert.title })
  }

  const description = alreadySubscribed
    ? "Donnez de la visibilité à l'événement et contribuez à son succès en le partageant autour de vous !"
    : alert.description

  return (
    <YStack gap="$large" padding="$medium" maxWidth={media.gtSm ? 420 : undefined} pb={media.sm ? '$9' : '$medium'}>
      {alert.image_url ? (
        <YStack
          width="100%"
          maxWidth={MEETING_IMAGE_MAX_SIZE}
          maxHeight={MEETING_IMAGE_MAX_SIZE}
          aspectRatio={1}
          alignSelf="center"
          borderRadius={12}
          overflow="hidden"
        >
          <Image source={{ uri: alert.image_url }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
        </YStack>
      ) : null}

      <YStack gap="$small">
        <Text.LG semibold>{alert.title}</Text.LG>
        <VoxCard.Chip outlined theme={alreadySubscribed ? 'green' : 'yellow'} icon={alreadySubscribed ? Check : AlertTriangle}>
          {alreadySubscribed ? 'Inscrit' : 'Non inscrit'}
        </VoxCard.Chip>
      </YStack>

      <Text.SM secondary>{description}</Text.SM>

      <XStack gap="$small">
        {alert.share_url ? (
          <YStack flexShrink={1}>
            <VoxButton full variant="soft" theme="blue" size="lg" iconLeft={UserRound} onPress={onPressShare}>
              J’invite un ami
            </VoxButton>
          </YStack>
        ) : null}
        {hasTicket ? (
          <YStack flexGrow={1}>
            <VoxButton full variant="contained" theme="blue" size="lg" iconLeft={QrCode} onPress={() => setIsTicketOpen(true)}>
              Mon billet
            </VoxButton>
          </YStack>
        ) : alert.cta_label ? (
          <YStack flexGrow={1}>
            <VoxButton full variant="contained" theme="blue" size="lg" iconLeft={Ticket} disabled={!alert.cta_url} onPress={onReserve}>
              {alert.cta_label}
            </VoxButton>
          </YStack>
        ) : null}
      </XStack>

      <MeetingTicketModal alert={alert} isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} hitSource={hitSource} />
    </YStack>
  )
}
