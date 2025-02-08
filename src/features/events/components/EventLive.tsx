import { useEffect, useState } from 'react'
import VimeoPlayer from '@/components/VimeoPlayer'
import VoxCard from '@/components/VoxCard/VoxCard'
import clientEnv from '@/config/clientEnv'
import { useSession } from '@/ctx/SessionProvider'
import { EventItemProps } from '@/features/events/types'
import { isEventHasNationalLive, isEventStarted } from '../utils'
import EventLiveCountDown from './EventLiveCountDown'

export const EventLive = ({ event }: EventItemProps) => {
  const [started, setStarted] = useState(isEventStarted(event))
  const { session } = useSession()

  useEffect(() => {
    const tID = setInterval(() => {
      if (!isEventStarted(event) && isEventHasNationalLive(event)) {
        setStarted(isEventStarted(event))
      }
    }, 10000)

    return () => {
      clearInterval(tID)
    }
  }, [event])

  if (!started && isEventHasNationalLive(event)) {
    return (
      <VoxCard backgroundColor="black">
        <VoxCard.Content
          height={50}
          $sm={{
            height: 110,
            paddingTop: 70,
          }}
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
      <VoxCard backgroundColor="black" overflow="hidden">
        <VimeoPlayer dom={{ matchContents: true }} url={`${clientEnv.OAUTH_BASE_URL}/live-event/${event.slug}?token=${session?.accessToken}`} height={500} />
      </VoxCard>
    )
  }

  return null
}
