import React from 'react'
import { Platform } from 'react-native'
import { addHours, isBefore } from 'date-fns'
import { CalendarPlus, Share2 } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import ShareButton from '@/components/Buttons/ShareButton'
import { getFormatedVoxCardDate } from '@/components/utils'
import VoxCard from '@/components/VoxCard/VoxCard'
import { isEventFull } from '@/features_next/events/utils'

import clientEnv from '@/config/clientEnv'
import { useHandleCopyUrl } from '@/hooks/useHandleCopy'
import useShareApi from '@/hooks/useShareApi'
import useCreateEvent from '@/modules/Calendar/Calendar'
import * as eventTypes from '@/services/events/schema'
import { RestEvent } from '@/services/events/schema'
import { ActionStatus, ReadableActionType, RestActionFull } from '@/services/actions/schema'
import { useGetProfil } from '@/services/profile/hook'

export type EventShareGroupProps = {
  event: Partial<RestEvent> & Pick<RestEvent, 'uuid' | 'slug'>
}

export const useEventSharing = ({ event }: EventShareGroupProps) => {
  const handleCopyUrl = useHandleCopyUrl()
  const { data: profile } = useGetProfil()

  const shareUrl = `https://${clientEnv.ASSOCIATED_DOMAIN}/evenements/${event.slug}${profile?.id ? `?ref=${profile.id}` : ''}`
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

type ActionShareProps = {
  action: RestActionFull
}

export const useActionSharing = ({ action }: ActionShareProps) => {
  const handleCopyUrl = useHandleCopyUrl()
  const { data: profile } = useGetProfil()

  const shareUrl = `https://${clientEnv.ASSOCIATED_DOMAIN}/actions/${action.uuid}${profile?.id ? `?ref=${profile.id}` : ''}`
  const { shareAsync, isShareAvailable } = useShareApi()

  const handleShareUrl = () => {
    if (!isShareAvailable) {
      return
    }
    const title = ReadableActionType[action.type].toUpperCase()
    const formatedDateObj = getFormatedVoxCardDate({ start: action.date, end: action.date, showTime: true })
    const timezone = formatedDateObj?.timezone ? ` ${formatedDateObj.timezone}` : ''
    const dateLine = formatedDateObj ? formatedDateObj.date + timezone : ''

    shareAsync(
      Platform.select({
        android: {
          message: `${title}\n${dateLine}\n\n${shareUrl}`,
          url: shareUrl,
        },
        ios: {
          message: `${title}\n${dateLine}`,
          url: shareUrl,
        },
        default: {
          title: `${title}\n${dateLine}\n`,
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

export type DetailShareGroupProps =
  | { event: EventShareGroupProps['event']; action?: never }
  | { action: RestActionFull; event?: never }

function EventShareGroupInner({ event }: EventShareGroupProps) {
  const { copyUrl, shareUrl, openShareDialog, isShareAvailable } = useEventSharing({ event })

  const createEventData = (ev: Partial<eventTypes.RestFullEvent> & { begin_at: string }) => {
    return {
      title: ev.name,
      startDate: new Date(ev.begin_at).toISOString(),
      endDate: ev.finish_at ? new Date(ev.finish_at).toISOString() : new Date(ev.begin_at).toISOString(),
      location:
        ev.mode !== 'online' && ev.post_address
          ? `${ev.post_address.address}, ${ev.post_address.city_name} ${ev.post_address.postal_code}`
          : 'En ligne',
      notes: ev.visio_url ? `${ev.description}\n\nLien: ${ev.visio_url}` : ev.description,
      url: shareUrl,
      timeZone: ev.time_zone,
    }
  }

  const addToCalendar = useCreateEvent()

  const canAddEventToCalendar = (ev: EventShareGroupProps['event']): ev is Partial<eventTypes.RestFullEvent> & Pick<RestEvent, 'uuid' | 'slug' | 'begin_at'> => {
    return isEventFull(ev) && typeof ev.begin_at === 'string'
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
        <VoxButton variant="outlined" full size="xl" iconLeft={CalendarPlus} onPress={() => addToCalendar(createEventData(event))}>
          Ajouter à mon calendrier
        </VoxButton>
      ) : null}
    </VoxCard.Section>
  )
}

function ActionShareGroupInner({ action }: ActionShareProps) {
  const { copyUrl, shareUrl, openShareDialog, isShareAvailable } = useActionSharing({ action })
  const addToCalendar = useCreateEvent()

  const canAddToCalendar = action.status !== ActionStatus.CANCELLED && !isBefore(action.date, new Date())

  const createActionCalendarData = () => {
    const start = new Date(action.date)
    const end = addHours(start, 3)
    return {
      title: ReadableActionType[action.type],
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      location: `${action.post_address.address}, ${action.post_address.city_name} ${action.post_address.postal_code}`,
      notes: action.description ?? '',
      url: shareUrl,
      timeZone: 'Europe/Paris',
    }
  }

  return (
    <VoxCard.Section title="Partagez cette action avec vos contacts pour maximiser sa portée.">
      <ShareButton url={shareUrl} onPress={copyUrl} />

      {isShareAvailable && (
        <VoxButton variant="outlined" full size="xl" iconLeft={Share2} onPress={openShareDialog}>
          Partager
        </VoxButton>
      )}

      {canAddToCalendar ? (
        <VoxButton variant="outlined" full size="xl" iconLeft={CalendarPlus} onPress={() => addToCalendar(createActionCalendarData())}>
          Ajouter à mon calendrier
        </VoxButton>
      ) : null}
    </VoxCard.Section>
  )
}

export function DetailShareGroup(props: DetailShareGroupProps) {
  if ('action' in props && props.action) {
    return <ActionShareGroupInner action={props.action} />
  }
  return <EventShareGroupInner event={props.event} />
}
