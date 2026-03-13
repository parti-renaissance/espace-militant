import React, { memo, useCallback, useState } from 'react'
import { ActivityIndicator, Pressable } from 'react-native'
import { View, XStack, YStack } from 'tamagui'
import { Activity, Mail, MessageCircle, Phone } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import PanelModal from '@/components/PanelModal/PanelModal'
import ProfilePicture from '@/components/ProfilePicture'

import { Chip } from '@/components'
import type { IconComponent } from '@/models/common.model'
import { useAdherentDetail } from '@/services/adherents/hook'
import type { RestAdherentDetail, RestAdherentListItem } from '@/services/adherents/schema'
import { getRelativeActivityLabel } from '@/utils/DateFormatter'

import { FicheMilitantHeader } from './components/FicheMilitantHeader'
import { IdentiteTabContent } from './components/IdentiteTab'

export type FicheMilitantTabId = 'identite' | 'notes' | 'mandats'

function MilitantSummaryCard({ data, engagementScore = null }: { data: RestAdherentDetail | RestAdherentListItem; engagementScore?: number | null }) {
  const { first_name, last_name, image_url, age, public_id, last_activity_at, adherent_tags } = data
  const displayName = [first_name, last_name].filter(Boolean).join(' ') || '—'
  const adherentLabel = adherent_tags?.[0]?.label ?? null
  const activityLabel = getRelativeActivityLabel(last_activity_at)

  return (
    <YStack paddingHorizontal="$medium" paddingTop="$medium" gap="$medium">
      <XStack gap="$medium" alignItems="center" flexWrap="wrap">
        <ProfilePicture size={40} rounded src={image_url ?? undefined} fullName={displayName} alt={displayName} />
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
            <Text.SM semibold color={'$color5'} numberOfLines={1} ellipsizeMode="tail" textTransform="capitalize">
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
  )
}

function ActionButton({ Icon, label, onPress }: { Icon: IconComponent; label: string; onPress: () => void }) {
  return (
    <YStack
      onPress={onPress}
      alignItems="center"
      justifyContent="center"
      gap="$small"
      bg="$gray1"
      paddingVertical={12}
      paddingHorizontal={16}
      borderRadius="$small"
      flex={1}
      flexBasis={0}
      cursor="pointer"
      hoverStyle={{ bg: '$gray2' }}
      pressStyle={{ bg: '$gray3' }}
    >
      <Icon size={16} color="$textPrimary" />
      <Text.SM primary semibold>
        {label}
      </Text.SM>
    </YStack>
  )
}

// TODO: implement action buttons in the UI (SMS, call, email)
function _MilitantActionButtons({ onSms, onCall, onEmail }: { onSms?: () => void; onCall?: () => void; onEmail?: () => void }) {
  return (
    <XStack paddingHorizontal="$medium" paddingVertical="$medium" gap="$small">
      <ActionButton Icon={MessageCircle} label="SMS" onPress={onSms ?? (() => {})} />
      <ActionButton Icon={Phone} label="Appeler" onPress={onCall ?? (() => {})} />
      <ActionButton Icon={Mail} label="Email" onPress={onEmail ?? (() => {})} />
    </XStack>
  )
}

const TABS: { id: FicheMilitantTabId; label: string }[] = [
  { id: 'identite', label: 'Identité' },
  { id: 'notes', label: 'Notes' },
  { id: 'mandats', label: 'Mandats' },
]

function MilitantDetailTabs({ activeTab, onTabChange }: { activeTab: FicheMilitantTabId; onTabChange: (tab: FicheMilitantTabId) => void }) {
  return (
    <XStack borderBottomWidth={2} borderTopWidth={1} borderColor="$borderColor" paddingHorizontal="$medium" gap="$large" mt="$medium">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={{ paddingVertical: 12, paddingHorizontal: 4, marginBottom: -1 }}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <YStack position="relative">
              <Text.SM semibold color={isActive ? '$blue5' : '$textSecondary'}>
                {tab.label}
              </Text.SM>
            </YStack>
            {isActive && <XStack position="absolute" bottom={-1} left={0} right={0} height={2} backgroundColor="$blue5" borderRadius={1} />}
          </Pressable>
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

  const { data, isLoading, isFetching, isError, error } = useAdherentDetail(uuid, scope, {
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

  if (isError && !hasSummary) {
    return (
      <PanelModal isOpen={isOpen} onClose={onClose}>
        <FicheMilitantHeader onClose={onClose} />
        <YStack padding="$medium" gap="$small">
          <Text.SM semibold>Erreur</Text.SM>
          <Text.SM secondary>{errorMessage}</Text.SM>
        </YStack>
      </PanelModal>
    )
  }

  if (hasSummary && displayData) {
    return (
      <PanelModal isOpen={isOpen} onClose={onClose}>
        <YStack flex={1}>
          <FicheMilitantHeader onClose={onClose} />
          <MilitantSummaryCard data={displayData} />
          {/* <MilitantActionButtons onSms={() => {}} onCall={() => {}} onEmail={() => {}} /> */}
          <MilitantDetailTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === 'identite' && (
            <IdentiteTabContent
              isLoading={isFetching}
              summaryData={displayData}
              detailData={data ?? null}
              availableForResubscribeEmail={data?.available_for_resubscribe_email}
              onResubscribeEmail={() => {}}
            />
          )}

          {activeTab !== 'identite' && (
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
