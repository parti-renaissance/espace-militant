import { ReactNode, useState } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { AlertVoxCardProps, createOnShow } from '@/components/Cards'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import VoxCard from '@/components/VoxCard/VoxCard'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { ExternalLink, QrCode, Share2, Ticket } from '@tamagui/lucide-icons'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, XStack, YStack } from 'tamagui'

type MeetingAlertProps = {
  onShow: () => void
  onPressShare: () => void
} & AlertVoxCardProps

const MeetingAlertLayout = ({ alreadySubscribed, payload, children }: { alreadySubscribed: boolean; payload: RestAlertsResponse[0]; children: ReactNode }) => {
  return alreadySubscribed ? (
    <VoxCard.Content gap="$medium" alignItems="center">
      {payload.image_url && <Image src={payload.image_url} height={100} width="100%" resizeMode="contain" />}
      {children}
    </VoxCard.Content>
  ) : (
    <ImageBackground source={payload.image_url} contentFit="cover" style={{ flex: 1 }}>
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={{ flex: 1 }}>
        <VoxCard.Content gap="$medium" minHeight={165} justifyContent="flex-end">
          {children}
        </VoxCard.Content>
      </LinearGradient>
    </ImageBackground>
  )
}

const MeetingAlert = ({ payload, onShow, onPressShare, ...props }: MeetingAlertProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const alreadySubscribed = !!payload.data
  let themeColor = '$white1'

  if (alreadySubscribed) {
    themeColor = '$textPrimaire'
  }

  return (
    <VoxCard {...props} overflow="hidden">
      <MeetingAlertLayout alreadySubscribed={alreadySubscribed} payload={payload}>
        <YStack gap="$medium">
          <YStack gap="$small" alignItems={alreadySubscribed ? 'center' : 'flex-start'}>
            <XStack flexShrink={1}>
              <Text.LG multiline color={themeColor}>
                {payload.title}
              </Text.LG>
            </XStack>

            {alreadySubscribed && (
              <XStack flexShrink={1}>
                <Text.SM color={themeColor}>Vous êtes inscrit. Et si vous le partagiez autour de vous ?</Text.SM>
              </XStack>
            )}
          </YStack>

          <XStack gap="$small">
            {payload.share_url ? (
              <VoxButton
                variant={alreadySubscribed ? 'outlined' : 'soft'}
                size="sm"
                iconLeft={Share2}
                shrink={!alreadySubscribed}
                textColor={themeColor}
                backgroundColor="$white/32"
                onPress={onPressShare}
              >
                Partager
              </VoxButton>
            ) : null}
            {payload.cta_label && (
              <VoxButton
                variant={alreadySubscribed ? 'contained' : 'soft'}
                size="sm"
                disabled={!payload.cta_url}
                iconLeft={alreadySubscribed ? QrCode : Ticket}
                theme={alreadySubscribed ? 'blue' : 'gray'}
                textColor={alreadySubscribed ? '$white1' : themeColor}
                backgroundColor={alreadySubscribed ? '$blue5' : '$white/32'}
                onPress={alreadySubscribed ? () => setIsOpen(true) : onShow}
              >
                {payload.cta_label}
              </VoxButton>
            )}
          </XStack>
        </YStack>
        <TicketModal payload={payload} isOpen={isOpen} closeModal={() => setIsOpen(false)} />
      </MeetingAlertLayout>
    </VoxCard>
  )
}

const TicketModal = ({ payload, isOpen, closeModal }: { payload: RestAlertsResponse[0]; isOpen: boolean; closeModal: () => void }) => {
  return (
    <ModalOrBottomSheet open={isOpen} onClose={closeModal}>
      <YStack $sm={{ marginBottom: '$9' }} padding={'$11'} gap={'$8'} alignItems="center">
        <Text semibold fontSize={'$6'} color="$textPrimary">
          {payload.data?.first_name} {payload.data?.last_name}
        </Text>
        {payload.data?.ticket_custom_detail && (
          <Text semibold fontSize={40} color="$blue9">
            {payload.data?.ticket_custom_detail}
          </Text>
        )}
        <Image src={payload.data?.ticket_url} width={200} height={200} resizeMode="contain" />
        <VoxButton variant="outlined" iconRight={ExternalLink} onPress={createOnShow(payload.data?.info_url)}>
          Voir les infos pratiques
        </VoxButton>
      </YStack>
    </ModalOrBottomSheet>
  )
}
export default MeetingAlert
