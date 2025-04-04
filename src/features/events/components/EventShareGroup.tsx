import React from 'react'
import { Platform } from 'react-native'
import { VoxButton } from '@/components/Button'
import ShareButton from '@/components/Buttons/ShareButton'
import { getFormatedVoxCardDate } from '@/components/utils'
import VoxCard from '@/components/VoxCard/VoxCard'
import clientEnv from '@/config/clientEnv'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import useShareApi from '@/hooks/useShareApi'
import useCreateEvent from '@/modules/Calendar/Calendar'
import * as eventTypes from '@/services/events/schema'
import { RestEvent } from '@/services/events/schema'
import { CalendarPlus, Share2 } from '@tamagui/lucide-icons'
import { isEventFull } from '../utils'

type Props = {
  event: Partial<RestEvent> & Pick<RestEvent, 'uuid' | 'slug'>
}

export const useEventSharing = ({ event }: Props) => {
  const handleCopyUrl = useHandleCopyUrl()

  const shareUrl = `https://${clientEnv.ASSOCIATED_DOMAIN}/evenements/${event.slug}`
  const { shareAsync, isShareAvailable } = useShareApi()

  const handleShareUrl = () => {
    if (!event.name || !isShareAvailable) {
      return
    }
    const date = () => {
      const start = event.begin_at ? new Date(event.begin_at) : null
      const endDate = event.finish_at ?? event.begin_at
      const end = endDate ? new Date(endDate) : undefined
      const formatedDateObj = start ? getFormatedVoxCardDate({ start, end, timeZone: event.time_zone }) : undefined
      const timezone = formatedDateObj?.timezone ? ` ${formatedDateObj?.timezone}` : ''

      return formatedDateObj ? formatedDateObj.date + timezone : ''
    }
    const name = event.name.toUpperCase()
    shareAsync(
      Platform.select({
        android: {
          message: `${name}\n${date()}\n\n${shareUrl}`,
          url: shareUrl,
        },
        ios: {
          message: `${name}\n${date()}`,
          url: shareUrl,
        },
        default: {
          title: `${name}\n${date()}\n`,
          url: shareUrl,
        },
      }),
    ).catch(() => {})
  }
  return {
    copyUrl: () => handleCopyUrl(shareUrl),
    shareUrl,
    openShareDialog: handleShareUrl,
    isShareAvailable,
  }
}

export function EventShareGroup({ event }: Props) {
  const { copyUrl, shareUrl, openShareDialog, isShareAvailable } = useEventSharing({ event })

  const createEventData = (event: Partial<eventTypes.RestFullEvent> & { begin_at: string }) => {
    return {
      title: event.name,
      startDate: new Date(event.begin_at).toISOString(),
      endDate: event.finish_at ? new Date(event.finish_at).toISOString() : new Date(event.begin_at).toISOString(),
      location:
        event.mode !== 'online' && event.post_address
          ? `${event.post_address.address}, ${event.post_address.city_name} ${event.post_address.postal_code}`
          : 'En ligne',
      notes: event.visio_url ? `${event.description}\n\nLien: ${event.visio_url}` : event.description,
      url: shareUrl,
      timeZone: event.time_zone,
    }
  }

  const addToCalendar = useCreateEvent()

  const canAddEventToCalendar = (event: Props['event']): event is Partial<eventTypes.RestFullEvent> & Pick<RestEvent, 'uuid' | 'slug' | 'begin_at'> => {
    return isEventFull(event) && typeof event.begin_at === 'string'
  }

  return (
    <VoxCard.Section title="Partagez cet événement avec vos contacts pour maximiser sa portée.">
      <ShareButton url={shareUrl} onPress={copyUrl} />

      {isShareAvailable && (
        <VoxButton variant="outlined" full size="xl" iconLeft={Share2} onPress={openShareDialog}>
          Partager
        </VoxButton>
      )}

      {canAddEventToCalendar(event) ? (
        <>
          <VoxButton variant="outlined" full size="xl" iconLeft={CalendarPlus} onPress={() => addToCalendar(createEventData(event))}>
            Ajouter à mon calendrier
          </VoxButton>
        </>
      ) : null}
    </VoxCard.Section>
  )
}
