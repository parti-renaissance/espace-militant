import type { ActionVoxCardProps } from '@/components/Cards/ActionCard'
import type { NewsVoxCardProps } from '@/components/Cards/NewsCard'
import type { PublicationCardProps } from '@/components/Cards/PublicationCard/PublicationCard'
import type { SocialPostCardProps } from '@/components/Cards/SocialPostCard/SocialPostCard'
import type { TransactionalCardProps } from '@/components/Cards/TransactionalCard'
import type { EventItemProps } from '@/features_next/events/types'
import type { HitSource } from '@/services/hits/constants'

export type FeedCardProps = {
  hitSource?: HitSource
} & (
  | ({
      type: 'event'
    } & EventItemProps)
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
  | ({
      type: 'social_post'
    } & SocialPostCardProps)
)
