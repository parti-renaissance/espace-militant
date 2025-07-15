import React, { useState } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import type { AlertVoxCardProps } from '@/components/Cards'
import { createOnShow } from '@/components/Cards/AlertCard/utils'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import VoxCard from '@/components/VoxCard/VoxCard'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { AlertTriangle, Check, ExternalLink, QrCode, Share2, Ticket } from '@tamagui/lucide-icons'
import { Image, XStack, YStack } from 'tamagui'

export type MeetingAlertCollapsedProps = {
  payload: RestAlertsResponse[0]
  onShow: () => void
  onPressShare: () => void
} & AlertVoxCardProps

const TicketModal = ({ payload, isOpen, closeModal }: { payload: RestAlertsResponse[0]; isOpen: boolean; closeModal: () => void }) => {
  return (
    <ModalOrBottomSheet open={isOpen} onClose={closeModal}>
      <YStack $sm={{ marginBottom: '$9' }} padding={'$11'} gap={'$8'} alignSelf={'center'} alignItems="center" maxWidth={480}>
        <Text semibold fontSize={'$6'} color="$textPrimary">
          {payload.data?.first_name} {payload.data?.last_name}
        </Text>
        {payload.data?.ticket_custom_detail && (
          <Text semibold fontSize={40} color="$blue9" textAlign="center">
            {payload.data?.ticket_custom_detail}
          </Text>
        )}
        <Image src={payload.data?.ticket_url} width={240} height={240} resizeMode="contain" />
        <VoxButton alignSelf={'center'} variant="outlined" iconRight={ExternalLink} onPress={createOnShow(payload.data?.info_url)}>
          Voir les infos pratiques
        </VoxButton>
      </YStack>
    </ModalOrBottomSheet>
  )
}

const MeetingAlertCollapsed = ({ payload, onPressShare, onShow, ...props }: MeetingAlertCollapsedProps) => {
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const alreadySubscribed = !!payload.data
  const hasTicket = !!payload?.data?.ticket_url

  return (
    <VoxCard key={`meeting-alert-${payload.title}`} borderRadius="$medium" overflow="hidden" {...props}>
      <VoxCard.Content gap="0">
        <XStack gap="$medium">
          {payload.image_url && <Image src={payload.image_url} width={91} height={91} borderRadius="$4" objectFit="cover" />}
          <YStack gap="$small" flexShrink={1} flexGrow={1}>
            <Text.LG numberOfLines={2} pt={6} flexShrink={1}>
              {payload.title}
            </Text.LG>
            <YStack animation="quick" enterStyle={{ opacity: 0, scaleY: 0.8 }} exitStyle={{ opacity: 0, scaleY: 0.8 }} animateOnly={['opacity', 'scaleY']}>
              {alreadySubscribed ? (
                <VoxCard.Chip icon={Check} theme="green">
                  Inscrit
                </VoxCard.Chip>
              ) : (
                <VoxCard.Chip icon={AlertTriangle} theme="yellow">
                  Non inscrit
                </VoxCard.Chip>
              )}
            </YStack>
          </YStack>
        </XStack>
        <YStack
          key="desc"
          animation="quick"
          enterStyle={{ opacity: 0, scaleY: 0.8 }}
          exitStyle={{ opacity: 0, scaleY: 0.8 }}
          animateOnly={['opacity', 'scaleY']}
        >
          {alreadySubscribed ? (
            <Text.SM my="$medium">Donnez de la visibilité à l'événement et contribuez à son succès en le partageant autour&nbsp;de&nbsp;vous&nbsp;!</Text.SM>
          ) : (
            <Text.SM my="$medium">{payload.description}</Text.SM>
          )}
          <XStack key="actions" gap="$small">
            {payload.share_url ? (
              <VoxButton
                variant={hasTicket ? 'contained' : 'outlined'}
                theme={hasTicket ? 'blue' : 'gray'}
                size="sm"
                iconLeft={Share2}
                onPress={() => {
                  onPressShare()
                }}
              >
                Partager
              </VoxButton>
            ) : null}
            {payload.cta_label && (
              <VoxButton
                variant={alreadySubscribed ? 'soft' : 'contained'}
                size="sm"
                disabled={!payload.cta_url}
                iconLeft={hasTicket ? QrCode : Ticket}
                theme={hasTicket ? 'gray' : 'blue'}
                onPress={() => {
                  if (hasTicket) {
                    setIsTicketOpen(true)
                  } else {
                    onShow()
                  }
                }}
              >
                {payload.cta_label}
              </VoxButton>
            )}
          </XStack>
        </YStack>
      </VoxCard.Content>
      <TicketModal payload={payload} isOpen={isTicketOpen} closeModal={() => setIsTicketOpen(false)} />
    </VoxCard>
  )
}

export default MeetingAlertCollapsed
