import { useState } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { AlertTriangle, Check, ChevronDown, Cross, QrCode, Share2, Ticket, X } from '@tamagui/lucide-icons'
import VoxCard from '@/components/VoxCard/VoxCard'
import type { AlertVoxCardProps } from '@/components/Cards'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { Image, XStack, YStack, View } from 'tamagui'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import { ExternalLink } from '@tamagui/lucide-icons'
import { createOnShow } from '@/components/Cards'
import { Animated } from 'react-native'
import { useRef, useEffect } from 'react'

export type MeetingAlertCollapsedProps = {
  payload: RestAlertsResponse[0]
  onShow: () => void
  onPressShare: () => void
} & AlertVoxCardProps

const AnimatedMeetingImage = ({ src, size }: { src: string, size: number }) => {
  const animatedValue = useRef(new Animated.Value(size)).current

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: size,
      useNativeDriver: false, // width/height ne sont pas supportés par le driver natif
      friction: 7,
      tension: 40,
    }).start()
  }, [size])

  return (
    <Animated.View style={{ width: animatedValue, height: animatedValue }}>
      <Image
        src={src}
        width="100%"
        height="100%"
        borderRadius="$4"
        objectFit="cover"
      />
    </Animated.View>
  )
}

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
  const [open, setOpen] = useState(true)
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const imageSize = open ? 91 : 48
  const alreadySubscribed = !!payload.data

  console.log('payload', payload);
  

  return (
    <VoxCard
      {...props}
      overflow="hidden"
      borderColor="$gray3"
    >
      <VoxCard.Content gap="0">
        <XStack gap="$medium" onPress={() => setOpen(!open)}>
          {payload.image_url && (
            <AnimatedMeetingImage src={payload.image_url} size={imageSize} />
          )}
          <YStack gap="$small" flexShrink={1} flexGrow={1}>
            <XStack alignItems="center" gap="$small" flexShrink={1} justifyContent="space-between">
              <Text.LG numberOfLines={2} pt={6} flexShrink={1}>{payload.title}</Text.LG>
              {open
                ? <View width={32} height={32}><X size={32} /></View>
                : <View width={32} height={32}><ChevronDown size={32} /></View>
              }
            </XStack>
            {open && (
              <YStack animation="quick" enterStyle={{ opacity: 0, scaleY: 0.8 }} exitStyle={{ opacity: 0, scaleY: 0.8 }} animateOnly={['opacity', 'scaleY']}>
                {alreadySubscribed
                  ? <VoxCard.Chip outlined icon={Check} theme="green">Inscrit</VoxCard.Chip>
                  : <VoxCard.Chip outlined icon={AlertTriangle} theme="yellow">Non inscrit</VoxCard.Chip>
                }
              </YStack>
            )}
          </YStack>
        </XStack>
        {open && (
          <YStack key="desc" animation="quick" enterStyle={{ opacity: 0, scaleY: 0.8 }} exitStyle={{ opacity: 0, scaleY: 0.8 }} animateOnly={['opacity', 'scaleY']}>
            {alreadySubscribed
              ? <Text.SM my="$medium">Donnez de la visibilité à l'événement et contribuez à son succès en le partageant autour&nbsp;de&nbsp;vous&nbsp;!</Text.SM>
              : <Text.SM my="$medium">{payload.description}</Text.SM>
            }
            <XStack key="actions" gap="$small">
              {payload.share_url ? (
                <VoxButton
                  variant={alreadySubscribed ? 'contained' : 'outlined'}
                  theme={alreadySubscribed ? 'blue' : 'gray'}
                  size="sm"
                  iconLeft={Share2}
                  onPress={e => {
                    onPressShare();
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
                  iconLeft={alreadySubscribed ? QrCode : Ticket}
                  theme={alreadySubscribed ? 'gray' : 'blue'}
                  onPress={e => {
                    alreadySubscribed ? setIsTicketOpen(true) : onShow()
                  }}
                >
                  {payload.cta_label}
                </VoxButton>
              )}
            </XStack>
          </YStack>
        )}
      </VoxCard.Content>
      <TicketModal payload={payload} isOpen={isTicketOpen} closeModal={() => setIsTicketOpen(false)} />
    </VoxCard>
  )
}

export default MeetingAlertCollapsed
