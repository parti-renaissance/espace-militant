import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { EventItemProps } from '@/features_next/events/types'
import { useFileDownload } from '@/hooks/useFileDownload'
import { getEventParticipantsFileEndpoint } from '@/services/events/api'
import { UserScopesEnum } from '@/services/profile/schema'
import { useEventStats } from '@/services/stats/hook'
import { Download, Sparkle } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import { EventParticipantsTable } from '../components/EventParticipantsTable'
import { isEventFull } from '../utils'
import EventHandleActions from './EventHandleActions'
import EventStatsCard from './EventStatsCard'

const EventManagementSection = ({ event }: EventItemProps) => {
  const { handleDownload, isPending } = useFileDownload()
  const { data: stats } = useEventStats({
    uuid: event.uuid,
    enabled: event.object_state === 'full' && event.editable,
  })

  if (!isEventFull(event) || !event.editable) {
    return null
  }
  const scope = event?.organizer?.scope ?? UserScopesEnum.National

  const handlePress = () =>
    handleDownload({
      url: getEventParticipantsFileEndpoint({ eventId: event.uuid }),
      fileName: `liste_des_participants_${event.slug}`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      UTI: 'org.openxmlformats.spreadsheetml.sheet',
      publicDownload: false,
    })
  return (
    <YStack gap="$medium">
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

          <EventParticipantsTable eventId={event.uuid} displayInvitationStatus={event?.visibility?.startsWith('invitation')} />

          {stats && (
            <YStack gap="$medium" mt={'$medium'}>
              <Text.MD color="$purple6" semibold>
                Statistiques de l'événement
              </Text.MD>
              <EventStatsCard stats={stats} />
            </YStack>
          )}
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
    </YStack>
  )
}

export default EventManagementSection
