import { ActionCard } from '@/components/Cards/ActionCard'
import { NewsCard } from '@/components/Cards/NewsCard'
import EventListItem from '@/features_next/events/components/list-item/EventListItem'
import PublicationCard from '@/components/Cards/PublicationCard/PublicationCard'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import TransactionalCard from '../TransactionalCard'
import SocialPostCard from '../SocialPostCard/SocialPostCard'

import type { FeedCardProps } from './FeedCard.types'

export type { FeedCardProps } from './FeedCard.types'

function FeedCard(props: FeedCardProps) {
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
    case 'social_post':
      return <SocialPostCard {...props} />
    default:
      return null
  }
}

export default FeedCard
