import React, { memo, useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, LayoutChangeEvent } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { View, XStack, YStack } from 'tamagui'
import { Activity, CircleAlert, Maximize2, Minimize2 } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import PanelModal from '@/components/PanelModal/PanelModal'

import { Chip } from '@/components'
import { useAdherentDetail } from '@/services/adherents/hook'
import type { RestAdherentDetail, RestAdherentListItem } from '@/services/adherents/schema'
import { getRelativeActivityLabel } from '@/utils/DateFormatter'

import { ElectMandatTab } from './components/ElectMandatTap'
import { FicheMilitantHeader } from './components/FicheMilitantHeader'
import { IdentiteTabContent } from './components/IdentiteTab'
import { MilitantActionButtons } from './components/MilitantActionButtons'

export type FicheMilitantTabId = 'identite' | 'notes' | 'historique' | 'mandats'

const PROFILE_PHOTO_COLLAPSED_HEIGHT = 200
const PROFILE_PHOTO_EXPAND_TIMING = { duration: 280, easing: Easing.inOut(Easing.cubic) }

function MilitantProfilePicture({ imageUrl, displayName }: { imageUrl: string | null; displayName: string }) {
  const [open, setOpen] = useState(false)
  const [rowWidth, setRowWidth] = useState(0)
  const animatedHeight = useSharedValue(PROFILE_PHOTO_COLLAPSED_HEIGHT)

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map(([letter]) => letter?.toUpperCase())
    .join('')

  useEffect(() => {
    if (rowWidth <= 0) return
    const target = open ? rowWidth : PROFILE_PHOTO_COLLAPSED_HEIGHT
    animatedHeight.value = withTiming(target, PROFILE_PHOTO_EXPAND_TIMING)
  }, [open, rowWidth, animatedHeight])

  const onPhotoRowLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    setRowWidth((prev) => (prev === w ? prev : w))
  }, [])

  const photoFrameStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    width: '100%' as const,
    overflow: 'hidden' as const,
  }))

  const toggleExpand = useCallback(() => setOpen((v) => !v), [])

  if (!imageUrl) {
    return (
      <YStack alignItems="center" justifyContent="center" flex={1} height={200} bg="$gray8" pt="$large">
        <Text fontSize={128} medium color="$textDisabled">
          {initials}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} bg="$gray8" onLayout={onPhotoRowLayout}>
      <Animated.View style={photoFrameStyle}>
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" alt={displayName} />
        <View position="absolute" right="$small" bottom={12} opacity={0.6}>
          <VoxButton theme="gray" size="sm" variant="soft" shrink iconLeft={open ? Minimize2 : Maximize2} onPress={toggleExpand} iconSize={14} />
        </View>
      </Animated.View>
    </YStack>
  )
}

function MilitantSummaryCard({ data, engagementScore = null }: { data: RestAdherentDetail | RestAdherentListItem; engagementScore?: number | null }) {
  const { first_name, last_name, age, public_id, last_activity_at, adherent_tags } = data
  const displayName = [first_name, last_name].filter(Boolean).join(' ') || '—'
  const adherentLabel = adherent_tags?.[0]?.label ?? null
  const activityLabel = getRelativeActivityLabel(last_activity_at)

  return (
    <>
      <MilitantProfilePicture imageUrl={data.image_url} displayName={displayName} />
      <YStack paddingHorizontal="$medium" paddingTop="$medium" gap="$medium">
        <XStack gap="$medium" alignItems="center" flexWrap="wrap">
          <XStack gap={4} flex={1}>
            <YStack flex={1} minWidth={120} gap={2}>
              <Text.SM semibold>{displayName}</Text.SM>
              {age != null && <Text.SM secondary>{age} ans</Text.SM>}
              {engagementScore != null && (
                <XStack alignItems="center" gap={8} marginTop={4}>
                  <View flex={1} h={8} backgroundColor="$gray4" borderRadius={4} overflow="hidden">
                    <View width={`${Math.min(100, engagementScore)}%`} h="100%" backgroundColor="$green9" borderRadius={4} />
                  </View>
                  <Text.SM semibold>{engagementScore}</Text.SM>
                </XStack>
              )}
            </YStack>
            {public_id && (
              <XStack alignSelf="flex-start" alignItems="center" gap={4}>
                <Text.SM secondary>{public_id}</Text.SM>
              </XStack>
            )}
          </XStack>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between" gap="$medium">
          {adherentLabel && (
            <Chip theme="yellow" flexShrink={1}>
              <Text.SM semibold color={'$color5'} numberOfLines={1} ellipsizeMode="tail">
                {adherentLabel}
              </Text.SM>
            </Chip>
          )}
          {activityLabel && (
            <XStack alignItems="center" gap={4}>
              <Activity size={12} color="$green5" />
              <Text.XSM secondary>{activityLabel}</Text.XSM>
            </XStack>
          )}
        </XStack>
      </YStack>
    </>
  )
}

const TABS: { id: FicheMilitantTabId; label: string }[] = [
  { id: 'identite', label: 'Identité' },
  { id: 'notes', label: 'Notes' },
  { id: 'historique', label: 'Historique' },
  { id: 'mandats', label: 'Mandats' },
]

function MilitantDetailTabs({ activeTab, onTabChange }: { activeTab: FicheMilitantTabId; onTabChange: (tab: FicheMilitantTabId) => void }) {
  return (
    <XStack borderBottomWidth={2} borderTopWidth={1} borderColor="$borderColor" paddingHorizontal="$medium" mt="$medium">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <YStack
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            paddingVertical={12}
            marginBottom={-1}
            flex={1}
            flexShrink={0}
            cursor="pointer"
            group
            backgroundColor="transparent"
            hoverStyle={{ backgroundColor: 'transparent' }}
            pressStyle={{ backgroundColor: 'transparent' }}
            role="tab"
            aria-selected={isActive}
          >
            <YStack position="relative">
              <Text.MD
                semibold
                textAlign="center"
                color={isActive ? '$blue5' : '$textPrimary'}
                $group-hover={!isActive ? { color: '$blue4' } : undefined}
                $group-press={!isActive ? { color: '$blue4' } : undefined}
              >
                {tab.label}
              </Text.MD>
            </YStack>
            {isActive && <XStack position="absolute" bottom={-1} left={1} right={1} height={2} backgroundColor="$blue5" borderRadius={1} />}
          </YStack>
        )
      })}
    </XStack>
  )
}

export interface MilitantDetailsPanelProps {
  uuid: string | undefined
  scope: string | undefined
  isOpen: boolean
  onClose: () => void
  initialData?: RestAdherentListItem | null
}

function MilitantDetailsPanelInner({ uuid, scope, isOpen, onClose, initialData }: MilitantDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<FicheMilitantTabId>('identite')

  const { data, isLoading, isFetching, isError, error, refetch } = useAdherentDetail(uuid, scope, {
    initialData: initialData ?? undefined,
  })

  const displayData = data ?? (initialData as RestAdherentDetail | undefined)
  const hasSummary = displayData != null
  const errorMessage = error?.message ?? 'Impossible de charger les détails.'

  const handleTabChange = useCallback((tab: FicheMilitantTabId) => {
    setActiveTab(tab)
  }, [])

  if (uuid && !hasSummary && isLoading) {
    return (
      <PanelModal isOpen={isOpen} onClose={onClose}>
        <YStack padding="$medium" alignItems="center" justifyContent="center" minHeight={200}>
          <ActivityIndicator size="large" />
          <Text.SM secondary style={{ marginTop: 12 }}>
            Chargement…
          </Text.SM>
        </YStack>
      </PanelModal>
    )
  }

  if (isError) {
    return (
      <PanelModal isOpen={isOpen} onClose={onClose}>
        <FicheMilitantHeader onClose={onClose} />
        <YStack gap="$medium" alignItems="center" justifyContent="center" flex={1} minHeight={300}>
          <CircleAlert size={48} color="$orange5" />
          <Text.SM color="$textDisabled" textAlign="center">
            {errorMessage}
          </Text.SM>
          <YStack>
            <VoxButton theme="orange" size="sm" variant="outlined" onPress={() => refetch()}>
              Réessayer
            </VoxButton>
          </YStack>
        </YStack>
      </PanelModal>
    )
  }

  if (hasSummary && displayData) {
    const smsAvailable = displayData.subscriptions?.sms?.available ?? true

    return (
      <PanelModal isOpen={isOpen} onClose={onClose}>
        <YStack flex={1}>
          <FicheMilitantHeader onClose={onClose} />
          <MilitantSummaryCard data={displayData} />
          <MilitantActionButtons uuid={uuid} scope={scope} smsAvailable={smsAvailable} />
          <MilitantDetailTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === 'identite' && (
            <IdentiteTabContent
              isLoading={isFetching}
              summaryData={displayData}
              detailData={data ?? null}
              availableForResubscribeEmail={data?.available_for_resubscribe_email}
              onResubscribeEmail={() => {}}
              uuid={uuid}
              scope={scope}
            />
          )}

          {activeTab === 'mandats' && (
            <ElectMandatTab uuid={uuid} scope={scope} electTags={displayData.elect_tags} electMandates={displayData.elect_mandates} />
          )}

          {activeTab !== 'identite' && activeTab !== 'mandats' && (
            <YStack padding="$medium" flex={1}>
              <Text.SM secondary>Bientôt disponible</Text.SM>
            </YStack>
          )}
        </YStack>
      </PanelModal>
    )
  }

  return (
    <PanelModal isOpen={isOpen} onClose={onClose}>
      <FicheMilitantHeader onClose={onClose} />
      <YStack padding="$medium">
        <Text.SM secondary>Sélectionnez un militant pour afficher ses détails.</Text.SM>
      </YStack>
    </PanelModal>
  )
}

export const MilitantDetailsPanel = memo(MilitantDetailsPanelInner)
