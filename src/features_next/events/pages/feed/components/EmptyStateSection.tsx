import { Link } from 'expo-router'
import { isWeb, YStack } from 'tamagui'
import { Ghost, Sparkle } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import useResetFilters from '@/features_next/events/hooks/useResetFilters'

import { useGetExecutiveScopes } from '@/services/profile/hook'
import { FEATURES } from '@/utils/Scopes'

export type EmptyStateReason =
  | { kind: 'zone_no_upcoming'; zoneLabel: string }
  | { kind: 'search_no_results'; search: string }
  | { kind: 'search_no_upcoming'; search?: string }
  | { kind: 'subscriptions_empty' }
  | { kind: 'subscriptions_no_upcoming' }
  | { kind: 'generic' }

type Props = {
  reason: EmptyStateReason
  onSwitchToAllEvents?: () => void
  showResetButton?: boolean
}

export const EmptyStateSection = ({ reason, onSwitchToAllEvents, showResetButton }: Props) => {
  const { hasFeature } = useGetExecutiveScopes()
  const { handleReset } = useResetFilters()

  const zoneLabel = reason.kind === 'zone_no_upcoming' ? reason.zoneLabel.replace(' • ', ' - ') : ''
  const searchTerm = reason.kind === 'search_no_upcoming' || reason.kind === 'search_no_results' ? reason.search : undefined

  const LABELS: Record<EmptyStateReason['kind'], string> = {
    zone_no_upcoming: `Aucun événement à venir dans le département\n${zoneLabel}`,
    search_no_results: searchTerm ? `Aucun événement ne correspond à votre recherche\n "${searchTerm}"` : 'Aucun événement ne correspond à votre recherche',
    search_no_upcoming: searchTerm ? `Aucun événement à venir pour\n "${searchTerm}"` : 'Aucun événement à venir pour votre recherche',
    subscriptions_empty: 'Vous ne vous êtes inscrit à aucun événement',
    subscriptions_no_upcoming: 'Vous ne vous êtes inscrit à aucun événement à venir',
    generic: 'Aucun événement à venir',
  }

  const canOrganize = hasFeature(FEATURES.EVENTS)
  const isSearch = reason.kind.startsWith('search')
  const isSub = reason.kind.startsWith('subscriptions')

  const Content = (
    <YStack alignItems="center" gap="$medium" py="$large" px="$medium">
      <Ghost size={32} color="$textOutline32" />

      <Text.MD secondary textAlign="center" semibold lineHeight={24}>
        {LABELS[reason.kind] || LABELS.generic}
      </Text.MD>

      <YStack alignItems="center" gap="$small">
        {(showResetButton || isSub) && (
          <YStack>
            <VoxButton
              variant="text"
              size="sm"
              theme="blue"
              onPress={() => {
                handleReset()
                onSwitchToAllEvents?.()
              }}
            >
              Réinitialiser les filtres
            </VoxButton>
          </YStack>
        )}

        {canOrganize && (reason.kind === 'generic' || reason.kind === 'zone_no_upcoming') && (
          <Link href="/evenements/creer" asChild={!isWeb}>
            <VoxButton variant="outlined" size="md" theme="purple" iconLeft={Sparkle}>
              {reason.kind === 'generic' ? "J'en organise un" : 'Organiser un événement'}
            </VoxButton>
          </Link>
        )}
      </YStack>
    </YStack>
  )

  return isSearch || reason.kind === 'generic' ? <VoxCard.Content>{Content}</VoxCard.Content> : Content
}
