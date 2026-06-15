import { ActionCard } from '@/components/Cards/ActionCard'
import { NewsCard } from '@/components/Cards/NewsCard'
import EventListItem from '@/features_next/events/components/list-item/EventListItem'
import PublicationCard from '@/components/Cards/PublicationCard/PublicationCard'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { HIT_SOURCES } from '@/services/hits/constants'
import TransactionalCard from '../TransactionalCard'
import SocialPostCard from '../SocialPostCard/SocialPostCard'

import type { FeedCardProps } from './FeedCard.types'

export type { FeedCardProps } from './FeedCard.types'

function FeedCard(props: FeedCardProps) {
  const { data } = useGetSuspenseProfil()
  const hitSource = props.hitSource ?? HIT_SOURCES.PAGE_TIMELINE

  switch (props.type) {
    case 'event':
      return <EventListItem {...props} userUuid={data!.uuid} source={hitSource} />
    case 'action':
      return <ActionCard {...props} />
    case 'news':
      return <NewsCard {...props} hitSource={hitSource} />
    case 'publication':
      return <PublicationCard {...props} hitSource={hitSource} />
    case 'transactional_message':
      return <TransactionalCard {...props} hitSource={hitSource} />
    case 'social_post':
      return <SocialPostCard {...props} />
    default:
      return null
  }
}

export default FeedCard
