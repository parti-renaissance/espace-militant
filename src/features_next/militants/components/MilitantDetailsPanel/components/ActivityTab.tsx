import React, { useState } from 'react'
import { Circle, Spinner, XStack, YStack } from 'tamagui'
import { Activity } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import Select from '@/components/base/Select/SelectV3'
import { VoxButton } from '@/components/Button'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { useAdherentActivity, useAdherentActivityFilters } from '@/services/adherents/hook'
import type { RestAdherentActivityItem } from '@/services/adherents/schema'
import { formatShortDate } from '@/utils/DateFormatter'

type FilterOption = { value: string; label: string }
type EventTypes = { hit: FilterOption[]; action_history: FilterOption[] }

const SOURCE_DEFAULT: FilterOption = { value: '', label: 'Toutes' }
const EVENT_DEFAULT: FilterOption = { value: '', label: 'Tous' }

const filterEventTypes = (eventTypes: EventTypes | undefined, source: string): FilterOption[] => {
  if (!eventTypes) return []
  if (source === 'hit') return eventTypes.hit
  if (source === 'action_history') return eventTypes.action_history
  return [...eventTypes.hit, ...eventTypes.action_history]
}

function ActivityRow({ item, isLast }: { item: RestAdherentActivityItem; isLast: boolean }) {
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
          {item.event_label}
        </Text>
        {item.description && (
          <Text color="$gray4" fontSize={12} fontWeight="400" lineHeight={14} pt={4}>
            {item.description}
          </Text>
        )}
      </YStack>
    </XStack>
  )
}

function ActivitySkeleton() {
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

interface ActivityTabProps {
  uuid: string | undefined
  scope: string | undefined
}

export function ActivityTabContent({ uuid, scope }: ActivityTabProps) {
  const [sourceType, setSourceType] = useState('')
  const [eventType, setEventType] = useState('')

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdherentActivity(uuid, scope, {
    sourceType: sourceType || undefined,
    eventType: eventType || undefined,
  })
  const { data: filters } = useAdherentActivityFilters(scope)

  const items = data?.pages.flatMap((p) => p.items) ?? []
  const sourceOptions = [SOURCE_DEFAULT, ...(filters?.source_types ?? [])]
  const eventOptions = [EVENT_DEFAULT, ...filterEventTypes(filters?.event_types, sourceType)]

  const handleSourceChange = (value: string) => {
    setSourceType(value)
    const allowed = filterEventTypes(filters?.event_types, value)
    if (eventType && !allowed.some((o) => o.value === eventType)) {
      setEventType('')
    }
  }

  return (
    <YStack flex={1} padding="$medium" paddingBottom={80}>
      <Text semibold primary fontSize={14} mb="$medium">
        Activité
      </Text>
      <YStack gap="$small" mb="$medium">
        <Select
          placeholder="Source"
          value={sourceType}
          options={sourceOptions}
          onChange={(v) => handleSourceChange(v ?? '')}
          color="gray"
          size="sm"
        />
        <Select
          placeholder="Événement"
          value={eventType}
          options={eventOptions}
          onChange={(v) => setEventType(v ?? '')}
          color="gray"
          size="sm"
        />
      </YStack>
      {isLoading ? (
        <ActivitySkeleton />
      ) : isError ? (
        <YStack padding="$medium" alignItems="center" gap="$small">
          <Text.SM secondary>Impossible de charger l'activité.</Text.SM>
        </YStack>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {items.map((item, i) => (
            <ActivityRow key={item.uuid} item={item} isLast={i === items.length - 1 && !hasNextPage} />
          ))}
          {hasNextPage && (
            <YStack pt="$small">
              <VoxButton
                theme="blue"
                variant="outlined"
                full
                loading={isFetchingNextPage}
                disabled={isFetchingNextPage}
                onPress={() => fetchNextPage()}
              >
                Afficher plus
              </VoxButton>
            </YStack>
          )}
          {isFetchingNextPage && !hasNextPage && (
            <XStack justifyContent="center" pt="$small">
              <Spinner size="small" />
            </XStack>
          )}
        </>
      )}
    </YStack>
  )
}
