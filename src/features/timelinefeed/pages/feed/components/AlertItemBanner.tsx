import { memo, useCallback, useRef, useState, type ComponentType } from 'react'
import { Platform } from 'react-native'
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { useMedia, XStack, YStack } from 'tamagui'
import { AlertTriangle, ChevronLeft, ChevronRight, Vote } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { createOnShow } from '@/components/Cards/AlertCard/utils'
import ModalOrBottomSheet from '@/components/ModalOrBottomSheet/ModalOrBottomSheet'
import Title from '@/components/Title/Title'
import VoxCard from '@/components/VoxCard/VoxCard'
import { FadingScrollView } from '@/features/events/components/feed-layout/FadingScrollView'
import { AlertMeetingSheet } from './AlertMeetingSheet'

import type { RestAlertsResponse } from '@/services/alerts/schema'
import { HIT_SOURCES, type HitSource } from '@/services/hits/constants'

type AlertItem = RestAlertsResponse[number]

const ALERT_IMAGE_SIZE = 140
const CARD_GAP = 12
const ELECTION_CARD_MIN_WIDTH = 300
const SCROLL_EPS = 2

const webNoSelectProps = Platform.OS === 'web' ? ({ userSelect: 'none' } as const) : {}
const preventWebMouseSelection = Platform.OS === 'web' ? (event: { preventDefault: () => void }) => event.preventDefault() : undefined

/* -------------------------------------------------------------------------- */
/* Variantes d'alerte                                                         */
/* Pour ajouter un type : créer son composant puis l'enregistrer dans         */
/* ALERT_VARIANTS avec sa largeur estimée (utilisée avant mesure du layout).  */
/* -------------------------------------------------------------------------- */

type AlertVariantProps = { alert: AlertItem; hitSource: HitSource; fullWidth?: boolean }

const AlertImageTile = memo(({ alert, onPress, pressable = true }: { alert: AlertItem; onPress?: () => void; pressable?: boolean }) => (
  <YStack
    width={ALERT_IMAGE_SIZE}
    height={ALERT_IMAGE_SIZE}
    borderRadius={8}
    overflow="hidden"
    backgroundColor="$gray100"
    cursor={pressable ? 'pointer' : undefined}
    onPress={pressable ? onPress : undefined}
    onMouseDown={pressable ? preventWebMouseSelection : undefined}
    pressStyle={pressable ? { opacity: 0.85 } : undefined}
    hoverStyle={pressable ? { opacity: 0.9 } : undefined}
    {...webNoSelectProps}
  >
    {alert.image_url ? (
      <Image
        source={{ uri: alert.image_url }}
        contentFit="cover"
        style={{ width: ALERT_IMAGE_SIZE, height: ALERT_IMAGE_SIZE, borderRadius: 8, ...(Platform.OS === 'web' ? { userSelect: 'none' } : {}) }}
      />
    ) : (
      <YStack
        width={ALERT_IMAGE_SIZE}
        height={ALERT_IMAGE_SIZE}
        borderRadius={8}
        backgroundColor="$red100"
        justifyContent="center"
        alignItems="center"
        p="$small"
        gap="$xsmall"
        {...webNoSelectProps}
      >
        <AlertTriangle size={32} color="$red600" />
        <Text.SM semibold color="$red600" textAlign="center">
          Image non disponible
        </Text.SM>
        <Text.SM color="$red600" textAlign="center" numberOfLines={3}>
          {alert.title}
        </Text.SM>
      </YStack>
    )}
  </YStack>
))

AlertImageTile.displayName = 'AlertImageTile'

const AlertImage = memo(({ alert, hitSource }: AlertVariantProps) => {
  const onShow = createOnShow(alert.cta_url, alert.cta_label, hitSource, alert)
  const isPressable = Boolean(alert.cta_url)

  return <AlertImageTile alert={alert} onPress={onShow} pressable={isPressable} />
})

AlertImage.displayName = 'AlertImage'

const AlertMeetingImage = memo(({ alert, hitSource }: AlertVariantProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AlertImageTile alert={alert} onPress={() => setIsOpen(true)} />
      <ModalOrBottomSheet open={isOpen} onClose={() => setIsOpen(false)} allowDrag>
        <AlertMeetingSheet alert={alert} hitSource={hitSource} />
      </ModalOrBottomSheet>
    </>
  )
})

AlertMeetingImage.displayName = 'AlertMeetingImage'

const AlertElectionCard = memo(({ alert, hitSource, fullWidth }: AlertVariantProps) => {
  const onShow = createOnShow(alert.cta_url, alert.cta_label, hitSource, alert)
  const isPressable = Boolean(alert.cta_url)

  return (
    <YStack
      flex={fullWidth ? 1 : undefined}
      minWidth={fullWidth ? undefined : ELECTION_CARD_MIN_WIDTH}
      width={fullWidth ? '100%' : undefined}
      height={ALERT_IMAGE_SIZE}
      {...webNoSelectProps}
    >
      <VoxCard
        borderRadius="$medium"
        flex={1}
        height={ALERT_IMAGE_SIZE}
        overflow="hidden"
        backgroundColor="$orange100"
        cursor={isPressable ? 'pointer' : undefined}
        onPress={isPressable ? onShow : undefined}
        onMouseDown={isPressable ? preventWebMouseSelection : undefined}
        pressStyle={isPressable ? { opacity: 0.85 } : undefined}
        hoverStyle={isPressable ? { opacity: 0.9 } : undefined}
        {...webNoSelectProps}
      >
        <VoxCard.Content flex={1} py={12} pl={12} pr={16}>
          <YStack gap="$small" flex={1} justifyContent="space-between">
            <YStack gap={12}>
              <XStack
                alignSelf="flex-start"
                alignItems="center"
                gap={6}
                backgroundColor="$orange9"
                borderRadius={999}
                paddingVertical={5}
                paddingHorizontal={10}
              >
                <Vote size={14} color="white" />
                <Text.SM semibold color="white">
                  Vote
                </Text.SM>
              </XStack>
              <Text.MD semibold numberOfLines={2}>
                {alert.title}
              </Text.MD>
            </YStack>
            <YStack pointerEvents="none">
              <VoxButton variant="text" bg="white" theme="orange" size="xs" flexShrink={0} disabled={!isPressable}>
                {alert.cta_label ?? 'Voir'}
              </VoxButton>
            </YStack>
          </YStack>
        </VoxCard.Content>
      </VoxCard>
    </YStack>
  )
})

AlertElectionCard.displayName = 'AlertElectionCard'

const ALERT_VARIANTS: Record<string, { Component: ComponentType<AlertVariantProps>; estimatedWidth: number }> = {
  default: { Component: AlertImage, estimatedWidth: ALERT_IMAGE_SIZE },
  election: { Component: AlertElectionCard, estimatedWidth: ELECTION_CARD_MIN_WIDTH },
  meeting: { Component: AlertMeetingImage, estimatedWidth: ALERT_IMAGE_SIZE },
}

const getVariant = (alert: AlertItem) => ALERT_VARIANTS[alert.type ?? ''] ?? ALERT_VARIANTS.default

/* -------------------------------------------------------------------------- */
/* Scroll : navigation par flèches                                            */
/* Les métriques vivent dans des refs (pas de re-rendu par frame de scroll) ; */
/* seuls les booléens d'activation des flèches déclenchent un rendu.          */
/* -------------------------------------------------------------------------- */

function getNearestItemIndex(offsetX: number, itemOffsets: number[]) {
  let nearestIndex = 0
  let minDistance = Infinity

  for (let i = 0; i < itemOffsets.length; i++) {
    const distance = Math.abs(itemOffsets[i] - offsetX)
    if (distance < minDistance) {
      minDistance = distance
      nearestIndex = i
    }
  }

  return nearestIndex
}

function useAlertScroller(alerts: RestAlertsResponse, paddingLeft: number) {
  const scrollRef = useRef<ScrollView>(null)
  const metricsRef = useRef({ offsetX: 0, contentW: 0, layoutW: 0 })
  const itemWidthsRef = useRef<number[]>([])
  const [nav, setNav] = useState({ left: false, right: alerts.length > 1 })

  const updateNav = useCallback(() => {
    const { offsetX, contentW, layoutW } = metricsRef.current
    const hasMetrics = contentW > SCROLL_EPS && layoutW > SCROLL_EPS
    const left = hasMetrics && offsetX > SCROLL_EPS
    const right = hasMetrics ? offsetX < contentW - layoutW - SCROLL_EPS : alerts.length > 1
    setNav((prev) => (prev.left === left && prev.right === right ? prev : { left, right }))
  }, [alerts.length])

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
      metricsRef.current = { offsetX: contentOffset.x, contentW: contentSize.width, layoutW: layoutMeasurement.width }
      updateNav()
    },
    [updateNav],
  )

  const onContentSizeChange = useCallback(
    (width: number) => {
      metricsRef.current.contentW = width
      updateNav()
    },
    [updateNav],
  )

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      metricsRef.current.layoutW = event.nativeEvent.layout.width
      updateNav()
    },
    [updateNav],
  )

  const onItemLayout = useCallback((index: number, width: number) => {
    itemWidthsRef.current[index] = width
  }, [])

  const scrollToNeighbor = useCallback(
    (direction: -1 | 1) => {
      let offset = paddingLeft
      const itemOffsets = alerts.map((alert, index) => {
        const current = offset
        offset += (itemWidthsRef.current[index] || getVariant(alert).estimatedWidth) + CARD_GAP
        return current
      })

      const { offsetX, contentW, layoutW } = metricsRef.current
      const targetIndex = getNearestItemIndex(offsetX, itemOffsets) + direction
      if (targetIndex >= alerts.length) return
      if (targetIndex < 0) {
        scrollRef.current?.scrollTo({ x: 0, animated: true })
        return
      }

      const maxScroll = Math.max(0, contentW - layoutW)
      const x = Math.min(maxScroll, Math.max(0, itemOffsets[targetIndex] - CARD_GAP))
      scrollRef.current?.scrollTo({ x, animated: true })
    },
    [alerts, paddingLeft],
  )

  return { scrollRef, nav, onScroll, onContentSizeChange, onLayout, onItemLayout, scrollToNeighbor }
}

const NavArrow = ({ Icon, enabled, onPress }: { Icon: typeof ChevronLeft; enabled: boolean; onPress: () => void }) => (
  <YStack
    px="$xsmall"
    opacity={enabled ? 1 : 0.4}
    cursor={enabled ? 'pointer' : 'default'}
    onPress={enabled ? onPress : undefined}
    onMouseDown={preventWebMouseSelection}
    pressStyle={enabled ? { opacity: 0.7 } : undefined}
    hoverStyle={enabled ? { opacity: 0.8 } : undefined}
    {...webNoSelectProps}
  >
    <Icon size={20} color="$textSecondary" />
  </YStack>
)

/* -------------------------------------------------------------------------- */
/* Banner                                                                     */
/* -------------------------------------------------------------------------- */

type AlertItemBannerProps = {
  alerts: RestAlertsResponse
  small?: boolean
  hitSource?: HitSource
}

export function AlertItemBanner({ alerts, small = false, hitSource = HIT_SOURCES.PAGE_TIMELINE }: AlertItemBannerProps) {
  const media = useMedia()
  const isSmallContainer = small || Boolean(media.sm)
  const scrollPaddingLeft = isSmallContainer ? 16 : 0
  const { scrollRef, nav, onScroll, onContentSizeChange, onLayout, onItemLayout, scrollToNeighbor } = useAlertScroller(alerts, scrollPaddingLeft)

  if (alerts.length === 0) return null

  const isSingleElection = alerts.length === 1 && alerts[0].type === 'election'
  const usesHorizontalScroll = alerts.length > 2 || isSmallContainer
  const showScrollNav = usesHorizontalScroll && alerts.length > 1
  const sectionTitle = alerts.length > 1 ? 'Infos à la une' : 'Info à la une'

  const row = (
    <XStack gap={CARD_GAP} alignItems="stretch">
      {alerts.map((alert, index) => {
        const { Component } = getVariant(alert)
        return (
          <YStack
            key={`${alert.title}-${index}`}
            flexShrink={0}
            onLayout={(event) => onItemLayout(index, event.nativeEvent.layout.width)}
            {...webNoSelectProps}
          >
            <Component alert={alert} hitSource={hitSource} fullWidth={isSingleElection} />
          </YStack>
        )
      })}
    </XStack>
  )

  return (
    <YStack width="100%" gap="$medium" mb="$medium">
      <XStack justifyContent="space-between" alignItems="center" px={media.gtSm ? 0 : '$medium'} gap="$small">
        <Title size="h2" aria-label={sectionTitle} flex={1}>
          <Title.Text>{sectionTitle}</Title.Text>
        </Title>
        {showScrollNav ? (
          <XStack flexShrink={0} alignItems="center">
            <NavArrow Icon={ChevronLeft} enabled={nav.left} onPress={() => scrollToNeighbor(-1)} />
            <NavArrow Icon={ChevronRight} enabled={nav.right} onPress={() => scrollToNeighbor(1)} />
          </XStack>
        ) : null}
      </XStack>
      <YStack width="100%" {...webNoSelectProps}>
        {usesHorizontalScroll ? (
          <FadingScrollView
            ref={scrollRef}
            showGradients={!isSmallContainer}
            onScroll={onScroll}
            onContentSizeChange={onContentSizeChange}
            onLayout={onLayout}
            contentContainerStyle={{ paddingLeft: scrollPaddingLeft, paddingRight: isSmallContainer ? 8 : 0 }}
          >
            {row}
          </FadingScrollView>
        ) : (
          row
        )}
      </YStack>
    </YStack>
  )
}
