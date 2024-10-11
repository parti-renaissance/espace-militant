import { Linking } from 'react-native'
import { type FeedCardProps } from '@/components/Cards'
import { ActionType } from '@/core/entities/Action'
import { logDefaultError } from '@/data/network/NetworkLogger'
import { ReadableActionType } from '@/services/actions/schema'
import { RestTimelineFeedItem } from '@/services/timeline-feed/schema'
import { router } from 'expo-router'

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
  }
}

export const transformFeedItemToProps = (feed: RestTimelineFeedItem): FeedCardProps => {
  const type = transformFeedItemType(feed.type)
  const author = {
    role: feed.author?.role ?? null,
    name: feed.author?.first_name && feed.author?.last_name ? `${feed.author.first_name} ${feed.author.last_name}` : null,
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
          image: feed.image ?? undefined,
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
      return {
        type,
        onShow: () => {
          router.push({
            pathname: '/(tabs)/(home)/(modals)/event-detail',
            params: { id: feed.objectID },
          })
        },
        payload: {
          id: feed.objectID,
          title: feed.title!,
          tag,
          image: feed.image ?? undefined,
          isSubscribed: !!feed.user_registered_at,
          date: {
            start: feed.begin_at ? new Date(feed.begin_at) : new Date(feed.date!),
            end: feed.finish_at ? new Date(feed.finish_at) : new Date(feed.date!),
            timeZone: feed.time_zone ?? undefined,
          },
          location: feed.mode === 'online' ? undefined : location,
          isOnline: feed.mode === 'online',
          author: { ...author, uuid: feed.author?.uuid },
          editable: feed.editable!,
          edit_link: feed.edit_link,
        },
      }
    case 'action':
      return {
        type,
        onShow: () => {
          router.push({
            pathname: '/(tabs)/actions',
            params: { uuid: feed.objectID },
          })
        },
        onEdit: () => {
          router.push({
            pathname: '/(tabs)/actions',
            params: { uuid: feed.objectID, action: 'edit' },
          })
        },
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
          // attendees: {
          //   pictures: ['https://picsum.photos/id/64/200/200', 'https://picsum.photos/id/66/200/200', 'https://picsum.photos/id/71/200/200'],
          //   count: 40,
          // },
        },
      }
  }
}
