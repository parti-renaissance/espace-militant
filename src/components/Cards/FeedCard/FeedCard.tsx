import { ComponentProps } from 'react'
import { ActionCard, ActionVoxCardProps } from '@/components/Cards/ActionCard'
import { NewsCard, NewsVoxCardProps } from '@/components/Cards/NewsCard'
import EventListItem from '@/features_next/events/components/EventListItem'
import PublicationCard, { PublicationCardProps } from '@/components/Cards/PublicationCard/PublicationCard'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import TransactionalCard, { TransactionalCardProps } from '../TransactionalCard'

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
  | ({
      type: 'transactional_message'
    } & TransactionalCardProps)

const FeedCard = (props: FeedCardProps) => {
  const { data } = useGetSuspenseProfil()
  switch (props.type) {
    case 'event':
      return <EventListItem {...props} userUuid={data!.uuid} source="page_timeline" />
    case 'action':
      return <ActionCard {...props} />
    case 'news':
      return <NewsCard {...props} />
    case 'publication':
      return <PublicationCard {...props} />
    case 'transactional_message':
      return <TransactionalCard {...props} />
    default:
      return null
  }
}

export default FeedCard
