import { type FeedCardProps } from '@/components/Cards'

import { ActionType, ReadableActionType } from '@/services/actions/schema'
import * as FeedMapper from '@/services/common/mapper/mapTimelineFeedToRestEvent'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'

const transformFeedItemType = (type: RestTimelineFeedItem['type']): FeedCardProps['type'] => {
  switch (type) {
    case 'news':
      return 'news'
    case 'event':
      return 'event'
    case 'action':
    case 'riposte':
    case 'phoning-campaign':
    case 'pap-campaign':
    case 'survey':
      return 'action'
    case 'publication':
      return 'publication'
    case 'transactional_message':
      return 'transactional_message'
    case 'social_network_post':
      return 'social_post'
  }
}

const transformFeedItemTypeToTag = (type: RestTimelineFeedItem['type']) => {
  switch (type) {
    case 'news':
      return 'Notification'
    case 'event':
      return 'Événement'
    case 'riposte':
      return 'Riposte'
    case 'phoning-campaign':
      return 'Campagne de phoning'
    case 'pap-campaign':
      return 'Campagne PAP'
    case 'survey':
      return 'Enquête'
    case 'publication':
      return 'Publication'
    case 'transactional_message':
      return 'Message'
    case 'social_network_post':
      return 'Réseau social'
  }
}

const getAuthorName = (feed: RestTimelineFeedItem) => {
  const parts = [feed.author?.first_name, feed.author?.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : null
}

const getSocialAuthorUsername = (feed: RestTimelineFeedItem) => {
  const raw = feed.author?.username
  if (raw) return raw.startsWith('@') ? raw : `@${raw}`
  if (feed.author?.first_name) return `@${feed.author.first_name}`
  return null
}

export const transformFeedItemToProps = (feed: RestTimelineFeedItem): FeedCardProps | undefined => {
  const type = transformFeedItemType(feed.type)
  if (!type) return undefined
  const author = {
    role: feed.author?.role ?? null,
    name: getAuthorName(feed),
    title: feed.author?.instance ?? null,
    pictureLink: feed.author?.image_url ?? undefined,
    zone: feed.author?.zone ?? null,
  }
  const location = feed.post_address
    ? {
        city: feed.post_address.city_name,
        postalCode: feed.post_address.postal_code,
        street: feed.post_address.address,
      }
    : undefined
  const tag = transformFeedItemTypeToTag(feed.type)!
  switch (type) {
    case 'news':
      return {
        type,
        payload: {
          title: feed.title!,
          tag,
          image: feed.image?.url ?? undefined,
          description: feed.description!,
          location,
          ctaLabel: feed.cta_label ?? null,
          ctaLink: feed.cta_link ?? null,
          author,
          date: {
            start: new Date(feed.date!),
            end: new Date(feed.date!),
          },
        },
      }
    case 'event':
      return { type, event: FeedMapper.map(feed) }
    case 'action':
      return {
        type,
        isMyAction: feed.editable ?? undefined,
        payload: {
          tag: ReadableActionType[feed.category?.toLowerCase() as ActionType],
          id: feed.objectID,
          isSubscribed: !!feed.user_registered_at,
          date: {
            start: feed.begin_at ? new Date(feed.begin_at) : new Date(feed.date!),
            end: feed.begin_at ? new Date(feed.begin_at) : new Date(feed.date!),
          },
          location,
          author,
        },
      }
    case 'publication':
      return {
        type,
        title: feed.title,
        description: feed.description,
        author: feed.author || undefined,
        date: feed.date,
        uuid: feed.objectID,
      }
    case 'transactional_message':
      return {
        type,
        title: feed.title!,
        description: feed.description!,
        ctaLink: feed.cta_link ?? '',
        ctaLabel: feed.cta_label ?? null,
      }
    case 'social_post':
      return {
        type,
        contentId: feed.objectID,
        description: feed.description,
        date: feed.date,
        author: {
          name: getAuthorName(feed),
          username: getSocialAuthorUsername(feed),
          pictureLink: feed.author?.image_url ?? undefined,
        },
        media: feed.media ?? null,
        image: feed.image,
      }
  }
}
