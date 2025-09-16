import { useEffect, useState } from 'react'
import VimeoPlayer from '@/components/VimeoPlayer'
import VoxCard from '@/components/VoxCard/VoxCard'
import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { EventItemProps } from '@/features/events/types'
import { isEventHasNationalLive, isEventStarted } from '../utils'
import EventLiveCountDown from './EventLiveCountDown'
import { useMedia } from 'tamagui'

export const EventLive = ({ event }: EventItemProps) => {
  const [started, setStarted] = useState(isEventStarted(event))
  const { session } = useSession()
  const media = useMedia()

  useEffect(() => {
    const tID = setInterval(() => {
      if (isEventHasNationalLive(event)) {
        setStarted(isEventStarted(event))
      }
    }, 1000)

    return () => {
      clearInterval(tID)
    }
  }, [event])

  if (!started && isEventHasNationalLive(event)) {
    return (
      <VoxCard backgroundColor="black" borderWidth={0}>
        <VoxCard.Content
          height={media.sm ? 110 : 50}
          paddingTop={media.sm ? 70 : undefined}
          justifyContent="center"
        >
          <EventLiveCountDown
            startDate={new Date(event.begin_at!)}
            textProps={{
              color: 'white',
            }}
          />
        </VoxCard.Content>
      </VoxCard>
    )
  }

  if (started && isEventHasNationalLive(event)) {
    return (
      <VoxCard backgroundColor="black" overflow="hidden" borderWidth={0} paddingTop={media.sm ? 90 : undefined}>
        <VimeoPlayer url={`${clientEnv.OAUTH_BASE_URL}/live-event/${event.slug}?token=${session?.accessToken}`} height={500} />
      </VoxCard>
    )
  }

  return null
}
