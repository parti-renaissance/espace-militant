import React from 'react'
import { Linking } from 'react-native'
import { View, XStack, YStack } from 'tamagui'
import {
  Calendar,
  Eye,
  Facebook,
  Flag,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Monitor,
  Music2,
  Phone,
  Send,
  Share2,
  Smartphone,
  Twitter,
} from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { getNationalityLabel } from '@/components/NationalitySelect/NationalitySelect'

import { Chip } from '@/components'
import type { IconComponent } from '@/models/common.model'
import type { RestAdherentDetail, RestAdherentListItem, RestAdherentRole, RestAdherentTag, RestSession } from '@/services/adherents/schema'
import { formatShortDate } from '@/utils/DateFormatter'

function DetailSection({ title, children, actionButton }: { title: string; children: React.ReactNode; actionButton?: React.ReactNode }) {
  return (
    <YStack gap="$small">
      <XStack justifyContent="space-between" alignItems="center">
        <Text.MD semibold primary>
          {title}
        </Text.MD>
        {actionButton}
      </XStack>
      {children}
    </YStack>
  )
}

function InfoRow({
  Icon,
  status,
  value,
  statusColor,
  desactivated,
  onSeeSecureData,
  actionButton,
}: {
  Icon: IconComponent
  status?: string | null
  value?: string | null
  statusColor?: 'green' | 'orange' | 'gray'
  desactivated?: boolean
  onSeeSecureData?: () => void
  actionButton?: React.ReactNode
}) {
  return (
    <YStack gap={12} bg="$textSurface" justifyContent="center" py="$small" pl={12} pr="$small" borderRadius="$small" minHeight={40}>
      <XStack gap={12} alignItems="center">
        <Icon size={18} color={desactivated ? '$textDisabled' : '$textPrimary'} />
        <YStack flex={1} minWidth={0} gap={6}>
          {status != null && status !== '' && (
            <XStack gap="$xsmall" alignItems="center">
              <View w={6} h={6} borderRadius={3} backgroundColor={statusColor === 'green' ? '$green9' : statusColor === 'orange' ? '$orange9' : '$gray9'} />
              <Text.XSM color="$gray4" semibold>
                {status}
              </Text.XSM>
            </XStack>
          )}
          {value != null && value !== '' ? (
            <Text.SM color={desactivated ? '$textDisabled' : '$textPrimary'}>{value}</Text.SM>
          ) : (
            <View w="90%" h={12} borderRadius={6} backgroundColor="$textOutline20" />
          )}
        </YStack>
        {onSeeSecureData && (
          <VoxButton size="sm" iconLeft={Eye} theme="gray" variant="outlined" onPress={onSeeSecureData} paddingHorizontal={12}>
            Voir
          </VoxButton>
        )}
      </XStack>
      {actionButton}
    </YStack>
  )
}

/** Skeleton qui reprend la structure d’un InfoRow (icône + lignes) */
function InfoRowSkeleton({ showStatusLine = true }: { showStatusLine?: boolean }) {
  return (
    <YStack gap={12} bg="$textSurface" py="$small" pl={12} pr="$small" borderRadius="$small" minHeight={40}>
      <XStack gap={12} alignItems="center">
        <View w={18} h={18} borderRadius={9} backgroundColor="$gray2" />
        <YStack flex={1} minWidth={0} gap={6}>
          {showStatusLine && (
            <XStack gap="$xsmall" alignItems="center">
              <View w={6} h={6} borderRadius={3} backgroundColor="$gray2" />
              <View w={80} h={10} borderRadius={4} backgroundColor="$textOutline20" />
            </XStack>
          )}
          <View w="90%" h={12} borderRadius={6} backgroundColor="$textOutline20" />
        </YStack>
      </XStack>
    </YStack>
  )
}

function InformationsPersonnellesSection({ isLoading, data }: { isLoading?: boolean; data: RestAdherentDetail | RestAdherentListItem }) {
  const { birthdate, subscriptions } = data
  const emailSubscribed = subscriptions?.email?.subscribed
  const emailStatus = emailSubscribed ? 'Abonné' : 'Désabonné'
  const smsAvailable = subscriptions?.sms?.available ?? true
  const smsSubscribed = subscriptions?.sms?.subscribed
  const smsStatus = smsSubscribed ? 'SMS autorisé' : 'SMS non autorisé'
  const nationality = 'nationality' in data ? data.nationality : undefined

  if (isLoading) {
    return (
      <DetailSection title="Informations personnelles">
        <YStack gap="$small">
          <InfoRowSkeleton showStatusLine />
          <InfoRowSkeleton showStatusLine />
          <InfoRowSkeleton showStatusLine={false} />
          <InfoRowSkeleton showStatusLine={false} />
          <InfoRowSkeleton showStatusLine={false} />
        </YStack>
      </DetailSection>
    )
  }

  return (
    <DetailSection title="Informations personnelles">
      <YStack gap="$small">
        <InfoRow
          Icon={Phone}
          status={!smsAvailable ? undefined : smsStatus}
          value={!smsAvailable ? 'Téléphone inconnu' : undefined}
          statusColor={!smsAvailable ? undefined : smsSubscribed ? 'green' : 'orange'}
          desactivated={!smsAvailable}
        />
        <InfoRow Icon={Mail} status={emailStatus} value={undefined} statusColor={emailSubscribed ? 'green' : 'orange'} />

        <InfoRow Icon={MapPin} value={undefined} />
        <InfoRow Icon={Calendar} value={birthdate ? `Né(e) le ${formatShortDate(birthdate)}` : '—'} />
        <InfoRow Icon={Flag} value={`Nationalité ${nationality ? getNationalityLabel(nationality) : 'inconnue'}`} />
      </YStack>
    </DetailSection>
  )
}

const SESSION_CHANNELS: { id: string; label: string; Icon: IconComponent }[] = [
  { id: 'mobile', label: 'Mobile', Icon: Smartphone },
  { id: 'web', label: 'Web', Icon: Monitor },
]

const SOCIAL_LINK_ICONS: Record<string, IconComponent> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  telegram: Send,
  tiktok: Music2,
}

function SessionRow({ session, Icon }: { session: RestSession; Icon: IconComponent }) {
  const statusLabel = session.subscribed ? `Notifications actives depuis ${formatShortDate(session.active_since)}` : 'Notifications désactivées'
  const valueLabel = `Actif depuis le ${formatShortDate(session.last_activity_at)} ${session.device ? `- ${session.device}` : ''}`
  return <InfoRow Icon={Icon} status={statusLabel} value={valueLabel} statusColor={session.subscribed ? 'green' : 'orange'} />
}

/** Retourne la session la plus récente (par last_activity_at) ou null */
function getLastSession(list: RestSession[]): RestSession | null {
  if (!Array.isArray(list) || list.length === 0) return null
  return (
    [...list].sort((a, b) => {
      const at = a.last_activity_at ? new Date(a.last_activity_at).getTime() : 0
      const bt = b.last_activity_at ? new Date(b.last_activity_at).getTime() : 0
      return bt - at
    })[0] ?? null
  )
}

function SessionsSection({ isLoading, data }: { isLoading?: boolean; data?: RestAdherentDetail | null }) {
  if (isLoading) {
    return (
      <YStack gap="$medium">
        <DetailSection title="Sessions">
          <YStack gap="$small">
            <InfoRowSkeleton showStatusLine />
            <InfoRowSkeleton showStatusLine />
          </YStack>
        </DetailSection>
      </YStack>
    )
  }

  if (!data) return null

  const { sessions, social_links } = data
  const sessionsByChannel = sessions && typeof sessions === 'object' && !Array.isArray(sessions) ? sessions : {}

  return (
    <YStack gap="$medium">
      <DetailSection title="Sessions">
        <YStack gap="$small">
          {SESSION_CHANNELS.map(({ id: channel, Icon }) => {
            const list = Array.isArray(sessionsByChannel[channel]) ? (sessionsByChannel[channel] as RestSession[]) : []
            const lastSession = getLastSession(list)
            return (
              <YStack key={channel} gap="$small">
                {lastSession ? (
                  <SessionRow session={lastSession} Icon={Icon} />
                ) : (
                  <InfoRow Icon={Icon} status="Notifications désactivées" value="Aucune session" desactivated={true} statusColor="orange" />
                )}
              </YStack>
            )
          })}
        </YStack>
      </DetailSection>
      {social_links && typeof social_links === 'object' && (
        <XStack flexWrap="wrap" gap="$small" alignItems="center">
          {Object.entries(social_links).map(([key, url]) => {
            const isDisabled = !url || !url.trim()
            const Icon = SOCIAL_LINK_ICONS[key as keyof typeof SOCIAL_LINK_ICONS] ?? Share2
            return (
              <VoxButton
                key={key}
                size="sm"
                theme="gray"
                variant="outlined"
                disabled={isDisabled}
                shrink
                iconLeft={Icon}
                onPress={() => url && url.trim() && Linking.openURL(url)}
              >
                {key}
              </VoxButton>
            )
          })}
        </XStack>
      )}
    </YStack>
  )
}

function RolesSection({ roles }: { roles: RestAdherentRole[] }) {
  return (
    <DetailSection title="Rôle(s)">
      <YStack gap="$small">
        <XStack flexWrap="wrap" gap={4}>
          {roles.length === 0 ? (
            <Text.SM color="$textDisabled">Ce militant ne dispose d’aucun rôle.</Text.SM>
          ) : (
            roles.map((r, index) => {
              const main = r.function ?? r.label ?? '—'
              const text = r.is_delegated ? `${main} (délégué)` : main
              return (
                <Chip key={`${r.code ?? 'role'}-${index}`} theme="purple" flexShrink={1} minWidth={0} maxWidth="100%">
                  <Text.SM color="$color5" semibold numberOfLines={1} ellipsizeMode="tail">
                    {text}
                  </Text.SM>
                </Chip>
              )
            })
          )}
        </XStack>
      </YStack>
    </DetailSection>
  )
}

function LabelsNationauxSection({ labels }: { labels: RestAdherentTag[] | null | undefined }) {
  const list = Array.isArray(labels) ? labels : []
  return (
    <DetailSection title="Labels nationaux">
      {list.length === 0 ? (
        <Text.SM color="$textDisabled">Ce militant ne dispose d’aucun label national.</Text.SM>
      ) : (
        <XStack flexWrap="wrap" gap="$small">
          {list.map((l, index) => (
            <Chip key={l.code ?? `${l.label}-${index}`} theme="gray">
              <Text.SM color="$color5" semibold numberOfLines={1} ellipsizeMode="tail" textTransform="capitalize">
                {l.label}
              </Text.SM>
            </Chip>
          ))}
        </XStack>
      )}
    </DetailSection>
  )
}

function PreferencesNotificationSection({ subscriptionTypes }: { subscriptionTypes: RestAdherentDetail['subscription_types'] }) {
  const list = Array.isArray(subscriptionTypes) ? subscriptionTypes : []
  return (
    <DetailSection title="Préférences de notification">
      <YStack gap={6} bg="$textSurface" p="$medium" borderRadius="$small">
        {list.length === 0 ? (
          <Text.SM color="$textDisabled">Ce militant ne dispose d’aucune préférence de notification.</Text.SM>
        ) : (
          list.map((st) => (
            <XStack key={st.code} alignItems="center" gap="$small">
              <View w={8} h={8} borderRadius={4} backgroundColor={st.checked === true ? '$green9' : '$orange9'} />
              <Text.SM color="$gray5" numberOfLines={1} ellipsizeMode="tail">
                {st.label}
              </Text.SM>
            </XStack>
          ))
        )}
      </YStack>
    </DetailSection>
  )
}

interface IdentiteTabContentProps {
  isLoading: boolean
  summaryData: RestAdherentDetail | RestAdherentListItem
  detailData: RestAdherentDetail | null
  availableForResubscribeEmail?: boolean
  onResubscribeEmail?: () => void
}

// TODO: implement resubscribe email functionality (availableForResubscribeEmail, onResubscribeEmail)
export function IdentiteTabContent({
  isLoading,
  summaryData,
  detailData,
  availableForResubscribeEmail: _availableForResubscribeEmail,
  onResubscribeEmail: _onResubscribeEmail,
}: IdentiteTabContentProps) {
  const roles = Array.isArray(summaryData.roles) ? summaryData.roles : []
  const staticTags = Array.isArray(summaryData.static_tags) ? summaryData.static_tags : []

  return (
    <YStack padding="$medium" gap="$large" paddingBottom={80}>
      <InformationsPersonnellesSection isLoading={isLoading} data={summaryData} />
      {(detailData || isLoading) && <SessionsSection isLoading={isLoading} data={detailData ?? null} />}
      <RolesSection roles={roles} />
      <LabelsNationauxSection labels={staticTags} />
      {detailData && <PreferencesNotificationSection subscriptionTypes={detailData.subscription_types} />}
    </YStack>
  )
}
