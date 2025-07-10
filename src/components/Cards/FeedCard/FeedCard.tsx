import { ComponentProps } from 'react'
import { ActionCard, ActionVoxCardProps } from '@/components/Cards/ActionCard'
import { NewsCard, NewsVoxCardProps } from '@/components/Cards/NewsCard'
import EventListItem from '@/features/events/components/EventListItem'
import PublicationCard, { PublicationCardProps } from '@/components/Cards/PublicationCard/PublicationCard'
import { useGetSuspenseProfil } from '@/services/profile/hook'

export type FeedCardProps =
  | ({
      type: 'event'
    } & ComponentProps<typeof EventListItem>)
  | ({
      type: 'action'
    } & ActionVoxCardProps)
  | ({
      type: 'news'
    } & NewsVoxCardProps)
  | ({
      type: 'publication'
    } & PublicationCardProps)

const FeedCard = (props: FeedCardProps) => {
  const { data } = useGetSuspenseProfil()
  switch (props.type) {
    case 'event':
      return <EventListItem {...props} userUuid={data!.uuid} />
    case 'action':
      return <ActionCard {...props} />
    case 'news':
      return <NewsCard {...props} />
    case 'publication':
      return <PublicationCard {...props} />
    default:
      return null
  }
}

export default FeedCard
