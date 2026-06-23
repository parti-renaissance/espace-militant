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
  const { hitSource: hitSourceProp, ...cardProps } = props
  const hitSource = hitSourceProp ?? HIT_SOURCES.PAGE_TIMELINE

  switch (cardProps.type) {
    case 'event':
      return <EventListItem {...cardProps} userUuid={data!.uuid} source={hitSource} />
    case 'action':
      return <ActionCard {...cardProps} hitSource={hitSource} />
    case 'news':
      return <NewsCard {...cardProps} hitSource={hitSource} />
    case 'publication':
      return <PublicationCard {...cardProps} hitSource={hitSource} />
    case 'transactional_message':
      return <TransactionalCard {...cardProps} hitSource={hitSource} />
    case 'social_post': {
      const { type: _type, ...socialPostProps } = cardProps
      return <SocialPostCard {...socialPostProps} />
    }
    default:
      return null
  }
}

export default FeedCard
