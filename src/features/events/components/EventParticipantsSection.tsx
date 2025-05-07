import { Suspense } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { EventItemProps } from '@/features/events/types'
import { useFileDownload } from '@/hooks/useFileDownload'
import { getEventParticipantsFileEndpoint } from '@/services/events/api'
import { Download, Sparkle } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'
import { EventParticipantsTable } from '../components/EventParticipantsTable'
import { isEventFull } from '../utils'
import EventHandleActions from './EventHandleActions'

const EventParticipantsSection = ({ event }: EventItemProps) => {
  const { handleDownload, isPending } = useFileDownload()
  if (!isEventFull(event) || !event.editable || !event.organizer) {
    return null
  }
  const scope = event.organizer.scope

  if (!scope) {
    return null
  }

  const handlePress = () =>
    handleDownload({
      url: getEventParticipantsFileEndpoint({
        eventId: event.uuid,
        scope: scope,
      }),
      fileName: `liste_des_participants_${event.slug}`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      UTI: 'org.openxmlformats.spreadsheetml.sheet',
      publicDownload: false,
    })
  return (
    <VoxCard>
        <VoxCard.Content>
          <XStack justifyContent="space-between">
            <XStack gap="$small" alignItems="center">
              <Sparkle size={16} color="$purple6" />
              <Text.LG color="$purple6" semibold>
                Gestion
              </Text.LG>
            </XStack>
          </XStack>

          <XStack justifyContent="space-between">
            <XStack gap="$small" alignItems="center">
              <Text.MD color="$purple6" semibold>
                Liste des participants
              </Text.MD>
            </XStack>
            <VoxButton variant="soft" theme="purple" size="sm" iconRight={Download} onPress={handlePress} loading={isPending}>
              Télécharger la liste
            </VoxButton>
          </XStack>

          <EventParticipantsTable eventId={event.uuid} scope={scope} />
          <VoxCard.Separator />
          <XStack justifyContent="space-between">
            <XStack gap="$small" alignItems="center">
              <Text.MD color="$purple6" semibold>
                Gérer l'événement
              </Text.MD>
            </XStack>
            <EventHandleActions
              scope={scope}
              //@ts-expect-error wrong type
              event={event}
              buttonProps={{
                theme: 'orange',
                size: 'sm',
                variant: 'soft',
              }}
            />
          </XStack>
        </VoxCard.Content>
      </VoxCard>
  )
}

export default EventParticipantsSection
