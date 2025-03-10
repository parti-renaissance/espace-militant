import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard, { VoxCardFrameProps } from '@/components/VoxCard/VoxCard'
import { useShareOrCopy } from '@/hooks/useShareOrCopy'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { genericErrorThrower } from '@/services/common/errors/generic-errors'
import { BellElectric, Check, ExternalLink, Radio, Share2, Ticket } from '@tamagui/lucide-icons'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Href, router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { isWeb, XStack, YStack } from 'tamagui'

const createOnShow = (url: string | null) => () => {
  if (url) {
    try {
      if (url.startsWith('/')) {
        router.push(url as Href)
      } else if (isWeb) {
        window.open(url, '_blank')
      } else {
        WebBrowser.openBrowserAsync(url)
      }
    } catch (error) {
      genericErrorThrower(error)
    }
  }
}

export type AlertVoxCardProps = {
  payload: RestAlertsResponse[0]
} & VoxCardFrameProps

const AlertMeetingSubscribeCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const { handleShareOrCopy } = useShareOrCopy()
  const onShow = createOnShow(payload.cta_url)

  const onPressShare = () => {
    if (!payload.share_url) return
    return handleShareOrCopy({ url: payload.share_url, message: payload.title })
  }

  return (
    <VoxCard {...props} overflow="hidden">
      <ImageBackground source={payload.image_url} contentFit="cover" style={{ flex: 1 }}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={{ flex: 1 }}>
          <VoxCard.Content height={165} justifyContent="flex-end">
            <YStack gap="$medium">
              <XStack flexShrink={1}>
                <Text.LG multiline color="$white1">
                  {payload.title}
                </Text.LG>
              </XStack>

              <XStack gap="$small">
                {payload.share_url ? (
                  <VoxButton variant="soft" size="sm" iconLeft={Share2} shrink textColor="$white1" backgroundColor="$white/32" onPress={onPressShare} />
                ) : null}
                {payload.cta_label && payload.cta_url && (
                  <VoxButton variant="soft" size="sm" iconLeft={Ticket} textColor="$white1" backgroundColor="$white/32" onPress={onShow}>
                    {payload.cta_label}
                  </VoxButton>
                )}
              </XStack>
            </YStack>
          </VoxCard.Content>
        </LinearGradient>
      </ImageBackground>
    </VoxCard>
  )
}

const AlertMeetingShareCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const { handleShareOrCopy } = useShareOrCopy()

  const onPressShare = () => {
    if (!payload.share_url) return
    return handleShareOrCopy({ url: payload.share_url, message: payload.title })
  }

  return (
    <VoxCard {...props} overflow="hidden" backgroundColor="$textOutline">
      <VoxCard.Content>
        <YStack gap="$xsmall">
          <XStack flexShrink={1}>
            <Text.LG multiline>{payload.title}</Text.LG>
          </XStack>

          <XStack flexShrink={1}>
            <Text.MD multiline>{payload.description}</Text.MD>
          </XStack>
        </YStack>
        <XStack gap="$small">
          {payload.cta_label && (
            <YStack height={32} paddingHorizontal="$medium" borderRadius="$12" borderColor="$textPrimary" borderWidth={1.5} justifyContent="center">
              <XStack gap={4} alignContent="center" alignItems="center">
                <Check size={16} color="$textPrimary" />
                <Text.MD semibold>{payload.cta_label}</Text.MD>
              </XStack>
            </YStack>
          )}
          {payload.share_url ? (
            <VoxButton size="sm" iconLeft={Share2} theme="blue" onPress={onPressShare}>
              Partager
            </VoxButton>
          ) : null}
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const AlertMeetingCard = (props: AlertVoxCardProps) => {
  if (!props.payload.cta_url) {
    return <AlertMeetingShareCard {...props} />
  }
  return <AlertMeetingSubscribeCard {...props} />
}

const AlertOnLiveCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const onShow = createOnShow(payload.cta_url)
  return (
    <VoxCard {...props} backgroundColor="$orange1">
      <VoxCard.Content gap="$small">
        <XStack justifyContent="space-between">
          <VoxCard.Chip alert icon={Radio}>
            {payload.label}
          </VoxCard.Chip>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack flexShrink={1}>
            <Text.LG multiline>{payload.title}</Text.LG>
          </XStack>

          {payload.cta_label && payload.cta_url && (
            <XStack justifyContent="flex-end">
              <VoxButton variant="soft" backgroundColor="white" theme="orange" textColor="#FF3333" onPress={onShow}>
                {payload.cta_label}
              </VoxButton>
            </XStack>
          )}
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const AlertAnnonceLiveCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const onShow = createOnShow(payload.cta_url)
  return (
    <VoxCard {...props} backgroundColor="$textOutline20">
      <VoxCard.Content gap="$small">
        <XStack justifyContent="space-between">
          <VoxCard.Chip alert icon={Radio}>
            {payload.label}
          </VoxCard.Chip>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack flexShrink={1}>
            <Text.LG multiline>{payload.title}</Text.LG>
          </XStack>
          {payload.cta_label && payload.cta_url && (
            <XStack justifyContent="flex-end">
              <VoxButton variant="soft" backgroundColor="white" theme="orange" textColor="#FF3333" onPress={onShow}>
                {payload.cta_label}
              </VoxButton>
            </XStack>
          )}
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const AlertBasicCard = ({ payload, ...props }: AlertVoxCardProps) => {
  const onShow = createOnShow(payload.cta_url)
  return (
    <VoxCard {...props}>
      <VoxCard.Content>
        <XStack justifyContent="space-between">
          <VoxCard.Chip theme="orange" icon={BellElectric}>
            {payload.label}
          </VoxCard.Chip>
        </XStack>
        <VoxCard.Title>{payload.title}</VoxCard.Title>
        <VoxCard.Description markdown>{payload.description}</VoxCard.Description>
        {payload.cta_label && payload.cta_url && (
          <XStack justifyContent="flex-end">
            <VoxButton variant="outlined" minWidth={80} iconLeft={ExternalLink} onPress={onShow}>
              {payload.cta_label}
            </VoxButton>
          </XStack>
        )}
      </VoxCard.Content>
    </VoxCard>
  )
}

const AlertCard = (props: AlertVoxCardProps) => {
  const {
    payload: { type },
  } = props
  if (!type) return <AlertBasicCard {...props} />
  if (type === 'live') return <AlertOnLiveCard {...props} />
  if (type === 'live_announce') return <AlertAnnonceLiveCard {...props} />
  if (type === 'meeting') return <AlertMeetingCard {...props} />
  return <AlertBasicCard {...props} />
}

export default AlertCard
