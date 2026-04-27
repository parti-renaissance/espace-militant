import React, { useState } from 'react'
import { Pressable } from 'react-native'
import { Circle, XStack, YStack } from 'tamagui'
import { Activity, ChevronsDownUp } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useAdherentActivity } from '@/services/adherents/hook'
import type { RestAdherentActivityItem } from '@/services/adherents/schema'
import { formatShortDate } from '@/utils/DateFormatter'

const INITIAL_COUNT = 10

const EVENT_TYPE_LABELS: Record<string, string> = {
  click: 'Clic',
  open: 'Ouverture',
  activity_session: 'Session active',
  email_change_validate: "Changement d'adresse email (validation)",
  email_change_request: "Changement d'adresse email (demande)",
  role_add: 'Ajout de rôle',
  role_remove: 'Suppression de rôle',
  profile_update: 'Mise à jour du profil',
  login_success: 'Connexion réussie',
  login_failure: 'Connexion échouée',
  password_reset_validate: 'Mot de passe oublié (changement)',
  password_reset_request: 'Mot de passe oublié (demande)',
  delegated_access_add: "Création d'accès délégué",
  delegated_access_edit: "Modification d'accès délégué",
  delegated_access_remove: "Suppression d'accès délégué",
  live_view: "Vue d'un événement live",
  agora_membership_add: "Nouveau membre d'Agora",
  agora_membership_remove: "Suppression de membre d'Agora",
}

const BUTTON_LABELS: Record<string, string> = {
  cta_share: 'Partager',
  cta_subscribe: "S'inscrire",
  cta_register: "S'inscrire",
  cta_remind_me: 'Me rappeler',
}

const SOURCE_LABELS: Record<string, string> = {
  direct_link: 'lien direct',
  push_notification: 'notification push',
  reload: 'rechargement',
  page_events: 'la page Événements',
  page_timeline: 'la timeline',
  page_publication_edition: 'la page de publication',
}

const OBJECT_TYPE_LABELS: Record<string, { article: string; label: string }> = {
  event: { article: 'un', label: 'événement' },
  publication: { article: 'une', label: 'publication' },
  news: { article: 'une', label: 'actualité' },
  alert: { article: 'une', label: 'alerte' },
  action: { article: 'une', label: 'action' },
}

type ActivityMeta = {
  source: string | null
  buttonName: string | null
  objectType: string | null
  objectName: string | null
}

function readMetadata(item: RestAdherentActivityItem): ActivityMeta | null {
  const m = item.metadata
  if (!m || typeof m !== 'object' || Array.isArray(m)) return null
  const rec = m as Record<string, unknown>
  const str = (k: string): string | null => (typeof rec[k] === 'string' && rec[k] ? (rec[k] as string) : null)
  return {
    source: str('source'),
    buttonName: str('button_name'),
    objectType: str('object_type'),
    objectName: str('object_name'),
  }
}

function describeObject(meta: ActivityMeta): string | null {
  const typeMeta = meta.objectType ? OBJECT_TYPE_LABELS[meta.objectType] : null
  if (meta.objectName) {
    return typeMeta ? `${typeMeta.article} ${typeMeta.label} "${meta.objectName}"` : `"${meta.objectName}"`
  }
  return typeMeta ? `${typeMeta.article} ${typeMeta.label}` : null
}

function buildActivitySentence(item: RestAdherentActivityItem, displayName: string): string | null {
  const meta = readMetadata(item)
  const object = meta ? describeObject(meta) : null
  const sourceLabel = meta?.source ? (SOURCE_LABELS[meta.source] ?? meta.source) : null

  switch (item.event_type) {
    case 'click': {
      const buttonRaw = meta?.buttonName ?? null
      const button = buttonRaw ? (BUTTON_LABELS[buttonRaw] ?? buttonRaw) : null
      if (button && object) return `${displayName} a cliqué sur "${button}" depuis ${object}`
      if (button) return `${displayName} a cliqué sur "${button}"`
      if (object) return `${displayName} a cliqué sur ${object}`
      return null
    }
    case 'open': {
      if (object && sourceLabel) return `${displayName} a ouvert ${object} (${sourceLabel})`
      if (object) return `${displayName} a ouvert ${object}`
      if (sourceLabel) return `${displayName} a ouvert une page (${sourceLabel})`
      return null
    }
    case 'activity_session':
      return sourceLabel ? `${displayName} était actif sur ${sourceLabel}` : null
    case 'login_success':
      return `${displayName} s'est connecté`
    case 'login_failure':
      return `${displayName} a échoué à se connecter`
    case 'profile_update':
      return `${displayName} a modifié son profil`
    case 'email_change_request':
      return `${displayName} a demandé un changement d'adresse email`
    case 'email_change_validate':
      return `${displayName} a validé son changement d'adresse email`
    case 'password_reset_request':
      return `${displayName} a demandé une réinitialisation de mot de passe`
    case 'password_reset_validate':
      return `${displayName} a réinitialisé son mot de passe`
    case 'role_add':
      return meta?.objectName ? `${displayName} a reçu le rôle "${meta.objectName}"` : null
    case 'role_remove':
      return meta?.objectName ? `${displayName} a perdu le rôle "${meta.objectName}"` : null
    case 'live_view':
      return object ? `${displayName} a vu ${object} en live` : null
    case 'agora_membership_add':
      return meta?.objectName ? `${displayName} a rejoint l'Agora "${meta.objectName}"` : null
    case 'agora_membership_remove':
      return meta?.objectName ? `${displayName} a quitté l'Agora "${meta.objectName}"` : null
    case 'delegated_access_add':
      return `${displayName} a reçu un accès délégué`
    case 'delegated_access_edit':
      return `${displayName} a vu son accès délégué modifié`
    case 'delegated_access_remove':
      return `${displayName} a perdu un accès délégué`
    default:
      return null
  }
}

function HistoryItemRow({ item, displayName, isLast }: { item: RestAdherentActivityItem; displayName: string; isLast: boolean }) {
  const description = buildActivitySentence(item, displayName)

  return (
    <XStack gap="$small" alignItems="stretch">
      <YStack alignItems="center" width={20} alignSelf="stretch">
        <Circle size={12} borderWidth={2} borderColor="$blue5" backgroundColor="$background" flexShrink={0} />
        {!isLast && <YStack flex={1} width={2} backgroundColor="$textOutline20" />}
      </YStack>
      <YStack flex={1} pb={16} gap={2}>
        <Text color="$gray4" fontSize={9} fontWeight="600" lineHeight={12}>
          {formatShortDate(item.occurred_at)}
        </Text>
        <Text color="$textPrimary" fontSize={14} fontWeight="500" lineHeight={14}>
          {EVENT_TYPE_LABELS[item.event_type] ?? item.event_type}
        </Text>
        {description && (
          <Text color="$gray4" fontSize={12} fontWeight="400" lineHeight={14} pt={4}>
            {description}
          </Text>
        )}
      </YStack>
    </XStack>
  )
}

function HistorySkeleton() {
  return (
    <YStack gap="$medium" padding="$medium">
      {[0, 1, 2, 3].map((i) => (
        <SkeCard key={i}>
          <SkeCard.Content>
            <SkeCard.Date />
            <SkeCard.Title />
          </SkeCard.Content>
        </SkeCard>
      ))}
    </YStack>
  )
}

function EmptyState() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$large" gap="$medium" minHeight={200}>
      <Activity size={40} color="$textDisabled" />
      <Text.SM secondary textAlign="center">
        Aucune activité disponible
      </Text.SM>
    </YStack>
  )
}

interface HistoriqueTabProps {
  uuid: string | undefined
  scope: string | undefined
  displayName: string
}

export function HistoriqueTabContent({ uuid, scope, displayName }: HistoriqueTabProps) {
  const [expanded, setExpanded] = useState(false)
  const { data, isLoading, isError } = useAdherentActivity(uuid, scope)

  if (isLoading) return <HistorySkeleton />

  if (isError) {
    return (
      <YStack padding="$medium" alignItems="center" gap="$small">
        <Text.SM secondary>Impossible de charger l'historique.</Text.SM>
      </YStack>
    )
  }

  const allItems = data?.items ?? []

  if (allItems.length === 0) return <EmptyState />

  const visibleItems = expanded ? allItems : allItems.slice(0, INITIAL_COUNT)
  const hiddenCount = allItems.length - INITIAL_COUNT

  return (
    <YStack flex={1} padding="$medium" paddingBottom={80}>
      <Text semibold primary fontSize={16} mb="$medium">
        Historique
      </Text>
      {visibleItems.map((item, index) => (
        <HistoryItemRow
          key={item.uuid}
          item={item}
          displayName={displayName}
          isLast={index === visibleItems.length - 1 && (expanded || hiddenCount <= 0)}
        />
      ))}
      {!expanded && hiddenCount > 0 && (
        <YStack pt="$small">
          <VoxButton theme="blue" variant="outlined" full onPress={() => setExpanded(true)}>
            Afficher plus
          </VoxButton>
        </YStack>
      )}
      {expanded && (
        <Pressable onPress={() => setExpanded(false)}>
          <XStack alignItems="center" gap={6} pt="$small">
            <ChevronsDownUp size={14} color="$blue6" />
            <Text color="$blue6" fontSize={14} fontWeight="600" lineHeight={14}>
              Réduire
            </Text>
          </XStack>
        </Pressable>
      )}
    </YStack>
  )
}
